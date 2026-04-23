#!/usr/bin/env python3
"""tg_broadcast.py — broadcast today's picks to a TG channel via Bot API.

Reads picks.json (produced by generate_picks.py), formats each pick as a
nicely-laid-out message, sends to TG channel/chat.

Usage:
    export TG_BOT_TOKEN="123456:ABC..."
    export TG_CHAT_ID="@winbetai_picks"  # or numeric chat id
    python3 tg_broadcast.py
    python3 tg_broadcast.py --dry-run   # print, don't send
    python3 tg_broadcast.py --product soccer-premium   # only one product
"""
import argparse, json, os, sys, urllib.parse, urllib.request, urllib.error, datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
PICKS_JSON = ROOT / 'web' / 'public' / 'picks.json'


def tg_send(bot_token, chat_id, text, parse_mode='HTML'):
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode,
        'disable_web_page_preview': 'true',
    }).encode()
    try:
        with urllib.request.urlopen(url, data=data, timeout=10) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'error': f'{e.code} {e.reason}', 'body': e.read().decode()[:200]}
    except Exception as e:
        return {'error': f'{type(e).__name__}: {str(e)[:200]}'}


def format_pick(pick, product_name):
    conf = pick.get('confidence', round(pick.get('model_prob', 0) * 100, 1))
    edge = pick.get('edge', 0) * 100
    return (
        f"<b>🎯 {product_name}</b>\n"
        f"<i>{pick.get('league_name', '')}</i>\n\n"
        f"<b>{pick['home']}</b> vs <b>{pick['away']}</b>\n"
        f"📅 {pick.get('date', '')[:16].replace('T', ' ')} UTC\n\n"
        f"Пик: <b>{pick.get('pick_ru') or pick.get('pick')}</b>\n"
        f"Коэффициент: <b>{pick['odds']}</b>\n"
        f"Уверенность модели: <b>{conf}%</b>\n"
        f"Edge: <b>+{edge:.1f}%</b>\n\n"
        f"<i>Модель: {pick.get('model', '')}</i>\n"
        f"<i>⚠️ 18+. Не финансовый совет.</i>"
    )


def format_summary(products, total):
    lines = [f"<b>📊 WinBetAi · {datetime.date.today().isoformat()}</b>\n"]
    for key, prod in products.items():
        n = len(prod.get('picks', []))
        if n == 0: continue
        lines.append(f"• <b>{prod['name']}</b>: {n} пик(ов)")
    lines.append(f"\n<i>Всего: {total} пиков сегодня</i>")
    lines.append("\nПолный список ниже ⬇️")
    return '\n'.join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--product', default=None, help='filter: soccer-premium, soccer-multi-league, nba-value, nba-premium')
    ap.add_argument('--picks-json', default=str(PICKS_JSON))
    args = ap.parse_args()

    if not os.path.exists(args.picks_json):
        print(f'ERROR: {args.picks_json} not found; run generate_picks.py first')
        sys.exit(1)

    with open(args.picks_json) as f:
        data = json.load(f)

    token = os.environ.get('TG_BOT_TOKEN')
    chat_id = os.environ.get('TG_CHAT_ID')
    if not args.dry_run and (not token or not chat_id):
        print('ERROR: TG_BOT_TOKEN and TG_CHAT_ID env vars required')
        sys.exit(1)

    total = data.get('total_picks', 0)
    if total == 0:
        msg = f"<b>📊 WinBetAi · {data.get('date', 'today')}</b>\n\nНет пиков по критериям моделей сегодня. Вернитесь завтра."
        if args.dry_run:
            print(msg)
        else:
            print(tg_send(token, chat_id, msg))
        return

    # Summary
    products_filtered = {k: v for k, v in data['products'].items() if (not args.product or k == args.product)}
    if not products_filtered:
        print(f'no product matching {args.product!r}')
        return
    filtered_total = sum(len(p['picks']) for p in products_filtered.values())

    summary = format_summary(products_filtered, filtered_total)
    if args.dry_run:
        print('--- SUMMARY ---'); print(summary); print()
    else:
        r = tg_send(token, chat_id, summary)
        if r.get('error'):
            print('summary send err:', r['error'])

    # Individual picks
    for key, prod in products_filtered.items():
        for pick in prod.get('picks', []):
            msg = format_pick(pick, prod['name'])
            if args.dry_run:
                print(f'--- {prod["name"]} pick ---'); print(msg); print()
            else:
                r = tg_send(token, chat_id, msg)
                if r.get('error'):
                    print(f'pick send err: {r["error"]}')


if __name__ == '__main__':
    main()
