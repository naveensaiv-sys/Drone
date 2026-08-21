# NorthSky Drone Co. — DJI Mini 5 Pro rentals in North York

A one-page website for renting out a DJI Mini 5 Pro (Fly More Combo), booking
aerial photo/video shoots, and selling ready-made drone footage in the Toronto area.

**Live site:** enable GitHub Pages once (see below) and it deploys automatically
on every push.

## What's on the site

| Way to earn | Launch pricing |
|---|---|
| Drone rental | $90/day · $150/weekend · $300/week (+$500 refundable deposit) |
| Aerial shoots (you fly) | $175 Starter Social · $199 Real Estate · $450 Event/Half-day |
| Footage store | $25/photo · $50/4K clip · custom flights from $99 |

Prices are based on 2025–2026 Toronto market research (local shops charge
$150/day for this drone; GTA real-estate drone shoots run $250–$500).

## How bookings reach you

- **Booking form** and **chat widget** send an email to `naveensai.v@gmail.com`
  via [FormSubmit](https://formsubmit.co) — free, no account needed.
- **Important (one-time):** the first time someone submits the form, FormSubmit
  emails you an activation link. Click it once and every future message arrives
  in your inbox. Reply to customers by email or text.
- Call/text/email buttons for 416-826-4143 are everywhere on the page.

## Going live (one time, ~2 minutes)

1. Merge this branch into `main` (or just keep pushing to it — the workflow
   deploys from both).
2. In GitHub: **Settings → Pages → Source: GitHub Actions** (the included
   workflow usually enables this automatically on first run).
3. Your site appears at `https://<username>.github.io/drone/`.
4. Optional: buy a domain (e.g. `northskydrone.ca`) and add it under
   **Settings → Pages → Custom domain**.

## Editing things

- **Prices / text:** everything is in `index.html` — search for the number you
  want to change.
- **Photos:** swap files in `assets/img/` (keep the same file names), ideally
  with your own real drone shots as you take them.
- **Colours / fonts:** top of `css/style.css` (`:root` variables).
- **Email / phone:** search `naveensai.v@gmail.com` and `4168264143` in
  `index.html` and `js/main.js`.

## Legal quick-notes (Canada, 2026)

- Sub-250 g drones need **no licence and no registration** (Transport Canada).
- Renting the drone out creates no TC obligations for the owner; the pilot is
  responsible for flying legally. The site's rental terms + a signed one-page
  agreement at pickup are still recommended.
- Toronto city parks, national parks and most provincial parks prohibit drones.
- Advertised public events need an SFOC permit — even for sub-250 g drones.
- Consider liability insurance as the business grows.

Site is plain HTML/CSS/JS — no build step, no dependencies.
