import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ============================================================================
   SOUTHBOUND ROASTERS: DISPATCH
   A scored, 50 minute revision game for VCE Business Management Unit 1,
   External business environment and planning.
   Six rounds, mixed activity types, auto-marked, feedback on every item.
============================================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800&family=Public+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.sbr, .sbr * { box-sizing: border-box; }
.sbr {
  --ink: #16211d;
  --ink2: #1e2c27;
  --ink3: #27352f;
  --panel: #f3eee2;
  --panel2: #e6dcc7;
  --amber: #e39b2c;
  --rust: #b24a2e;
  --teal: #2f8c7e;
  --line: #3a4b43;
  --muted: #93a49b;
  --dim: #6d8078;
  min-height: 100vh;
  background: var(--ink);
  background-image:
    repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 4px);
  color: var(--panel);
  font-family: 'Public Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  padding-bottom: 64px;
}
.sbr h1, .sbr h2, .sbr h3, .sbr .display {
  font-family: 'Archivo', system-ui, sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.05;
}
.sbr .mono { font-family: 'Space Mono', ui-monospace, monospace; }
.sbr button { font-family: inherit; cursor: pointer; }
.sbr button:focus-visible, .sbr input:focus-visible, .sbr textarea:focus-visible {
  outline: 3px solid var(--amber); outline-offset: 2px;
}

/* ---- dispatch strip ---- */
.strip {
  position: sticky; top: 0; z-index: 30;
  background: var(--ink2);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}
.strip-in {
  max-width: 940px; margin: 0 auto; padding: 10px 18px;
  display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
}
.brand { display: flex; align-items: baseline; gap: 9px; margin-right: auto; }
.brand .mark {
  font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.18em;
  color: var(--ink); background: var(--amber); padding: 3px 7px; border-radius: 2px;
}
.brand .nm { font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.01em; }
.gauge { text-align: right; }
.gauge .lab { font-family: 'Space Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; color: var(--muted); text-transform: uppercase; }
.gauge .val { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 19px; color: var(--panel); }
.gauge .val.hot { color: var(--amber); }

/* ---- rail ---- */
.rail { max-width: 940px; margin: 0 auto; padding: 14px 18px 0; display: flex; gap: 5px; }
.rail-seg { flex: 1; }
.rail-bar { height: 5px; background: var(--ink3); border-radius: 2px; }
.rail-bar.done { background: var(--teal); }
.rail-bar.now { background: var(--amber); }
.rail-lab { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.1em; color: var(--dim); margin-top: 5px; text-transform: uppercase; }
.rail-lab.now { color: var(--amber); }

/* ---- docket ---- */
.wrap { max-width: 940px; margin: 0 auto; padding: 22px 18px 0; }
.docket {
  background: var(--panel); color: var(--ink);
  border-radius: 3px;
  border: 1px solid var(--panel2);
  box-shadow: 0 18px 44px rgba(0,0,0,0.4);
  overflow: hidden;
  animation: slidein 320ms ease-out;
}
@keyframes slidein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.docket-head {
  padding: 16px 22px; border-bottom: 2px dashed var(--panel2);
  display: flex; align-items: flex-start; gap: 14px; flex-wrap: wrap;
}
.docket-head .num {
  font-family: 'Space Mono', monospace; font-weight: 700; font-size: 11px; letter-spacing: 0.16em;
  background: var(--ink); color: var(--amber); padding: 5px 9px; border-radius: 2px; white-space: nowrap;
}
.docket-head h2 { font-size: 25px; }
.docket-head p { margin: 5px 0 0; font-size: 13.5px; color: #5c5245; max-width: 56ch; }
.docket-body { padding: 22px; }
.docket-foot {
  padding: 13px 22px; border-top: 2px dashed var(--panel2);
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  font-family: 'Space Mono', monospace; font-size: 11px; color: #6c6154; letter-spacing: 0.06em;
}

/* ---- buttons ---- */
.btn {
  border: none; border-radius: 2px; padding: 12px 22px;
  font-family: 'Archivo', sans-serif; font-weight: 600; font-size: 14.5px;
  letter-spacing: 0.01em; transition: transform 90ms ease, filter 120ms ease;
}
.btn:active { transform: translateY(1px); }
.btn-go { background: var(--ink); color: var(--amber); }
.btn-go:hover { filter: brightness(1.35); }
.btn-ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--ink); }
.btn-ghost:hover { background: rgba(22,33,29,0.07); }
.btn-lite { background: var(--amber); color: var(--ink); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ---- options ---- */
.opts { display: grid; gap: 9px; }
.opt {
  width: 100%; text-align: left; background: #fff; color: var(--ink);
  border: 1.5px solid var(--panel2); border-radius: 3px; padding: 13px 15px;
  font-size: 14.5px; line-height: 1.45; display: flex; gap: 12px; align-items: flex-start;
  transition: border-color 110ms ease, background 110ms ease;
}
.opt:hover:not(:disabled) { border-color: var(--ink); background: #fffdf7; }
.opt .key {
  font-family: 'Space Mono', monospace; font-weight: 700; font-size: 11px;
  background: var(--panel2); color: #5c5245; border-radius: 2px; padding: 3px 7px; flex: none; margin-top: 1px;
}
.opt.right { border-color: var(--teal); background: #eef7f4; }
.opt.right .key { background: var(--teal); color: #fff; }
.opt.wrong { border-color: var(--rust); background: #fbefeb; }
.opt.wrong .key { background: var(--rust); color: #fff; }
.opt.picked { border-width: 2.5px; }
.opt.sel { border-color: var(--ink); background: #fffdf7; }
.opt.sel .key { background: var(--ink); color: var(--amber); }

/* ---- chips ---- */
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  background: #fff; border: 1.5px solid var(--panel2); border-radius: 999px;
  padding: 9px 15px; font-size: 13.5px; color: var(--ink); font-weight: 500;
}
.chip:hover:not(:disabled) { border-color: var(--ink); }
.chip.right { border-color: var(--teal); background: #eef7f4; }
.chip.wrong { border-color: var(--rust); background: #fbefeb; }

/* ---- stamp ---- */
.stamp {
  display: inline-block; transform: rotate(-6deg);
  font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 16px; letter-spacing: 0.16em;
  padding: 6px 14px; border: 3px solid currentColor; border-radius: 3px;
  animation: thump 260ms cubic-bezier(.2,1.6,.4,1);
}
@keyframes thump { from { transform: rotate(-6deg) scale(1.7); opacity: 0; } to { transform: rotate(-6deg) scale(1); opacity: 1; } }
.stamp.ok { color: var(--teal); }
.stamp.no { color: var(--rust); }

.feedback {
  margin-top: 16px; padding: 14px 16px; border-radius: 3px;
  background: var(--panel2); border-left: 4px solid var(--ink);
  font-size: 14px; color: #45403a;
}
.feedback strong { color: var(--ink); }

/* ---- misc ---- */
.metaline { font-family: 'Space Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #7a6f60; }
.qtext { font-size: 18px; font-weight: 600; line-height: 1.4; margin: 0 0 16px; font-family: 'Archivo', sans-serif; letter-spacing: -0.01em; }
.bins { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.bin {
  padding: 20px 16px; border-radius: 3px; border: 2px solid var(--ink); background: #fff;
  font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 16px; color: var(--ink);
  display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center;
}
.bin span { font-family: 'Public Sans', sans-serif; font-weight: 400; font-size: 12px; color: #6c6154; }
.bin:hover:not(:disabled) { background: var(--amber); }
.card-item {
  background: #fff; border: 1.5px solid var(--panel2); border-left: 5px solid var(--amber);
  border-radius: 3px; padding: 20px; font-size: 17px; line-height: 1.4; margin-bottom: 16px;
  font-weight: 500;
}
.tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.tbl th, .tbl td { text-align: left; padding: 9px 10px; border-bottom: 1px solid var(--panel2); }
.tbl th { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #7a6f60; }
.tbl td.num { font-family: 'Space Mono', monospace; }
.supbox { background: #fff; border: 1.5px solid var(--panel2); border-radius: 3px; padding: 14px 16px; margin-bottom: 10px; }
.supbox h4 { margin: 0 0 3px; font-family: 'Archivo', sans-serif; font-size: 15.5px; font-weight: 800; }
.supbox .sub { font-size: 12px; color: #7a6f60; margin-bottom: 9px; }

.ta {
  width: 100%; min-height: 260px; resize: vertical; padding: 15px;
  border: 1.5px solid var(--panel2); border-radius: 3px; background: #fff; color: var(--ink);
  font-family: 'Public Sans', sans-serif; font-size: 15px; line-height: 1.65;
}
.inp {
  padding: 11px 13px; border: 1.5px solid var(--panel2); border-radius: 3px;
  background: #fff; color: var(--ink); font-size: 14.5px; font-family: inherit;
}
.check {
  display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px; background: #fff;
  border: 1.5px solid var(--panel2); border-radius: 3px; margin-bottom: 8px; cursor: pointer;
  font-size: 14px; text-align: left; width: 100%; color: var(--ink); line-height: 1.45;
}
.check.on { border-color: var(--teal); background: #eef7f4; }
.check .box {
  width: 20px; height: 20px; flex: none; border: 2px solid var(--ink); border-radius: 2px;
  display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; margin-top: 1px;
}
.check.on .box { background: var(--teal); border-color: var(--teal); color: #fff; }

.ordrow {
  display: flex; gap: 10px; align-items: flex-start; background: #fff;
  border: 1.5px solid var(--panel2); border-radius: 3px; padding: 11px 13px; margin-bottom: 8px; font-size: 14px;
}
.ordrow.right { border-color: var(--teal); background: #eef7f4; }
.ordrow.wrong { border-color: var(--rust); background: #fbefeb; }
.ordbtns { display: flex; flex-direction: column; gap: 3px; flex: none; }
.ordbtns button {
  width: 26px; height: 20px; border: 1px solid var(--panel2); background: var(--panel);
  border-radius: 2px; font-size: 11px; line-height: 1; color: var(--ink);
}
.ordbtns button:hover:not(:disabled) { background: var(--amber); }
.ordnum { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 12px; color: #7a6f60; flex: none; margin-top: 3px; }

.grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; }
.statbox { background: #fff; border: 1.5px solid var(--panel2); border-radius: 3px; padding: 14px; }
.statbox .k { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase; color: #7a6f60; }
.statbox .v { font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 26px; margin-top: 2px; }
.bar { height: 8px; background: var(--panel2); border-radius: 99px; overflow: hidden; margin-top: 7px; }
.bar i { display: block; height: 100%; background: var(--teal); border-radius: 99px; }
.badge {
  display: inline-block; background: var(--ink); color: var(--amber); border-radius: 999px;
  padding: 6px 14px; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.09em; margin: 0 6px 6px 0;
}
.note { font-size: 13px; color: #6c6154; }
details.teach { background: var(--ink2); border: 1px solid var(--line); border-radius: 3px; padding: 14px 16px; margin-top: 16px; color: var(--panel); }
details.teach summary { cursor: pointer; font-family: 'Archivo', sans-serif; font-weight: 600; font-size: 14px; }
details.teach ul { margin: 12px 0 0; padding-left: 20px; font-size: 13.5px; color: #c8d3ce; }
details.teach li { margin-bottom: 6px; }

@media (max-width: 620px) {
  .bins { grid-template-columns: 1fr; }
  .docket-head h2 { font-size: 21px; }
  .strip-in { gap: 12px; }
  .gauge .val { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .sbr *, .sbr *::before { animation: none !important; transition: none !important; }
}
`;

/* ============================== CONTENT ============================== */

const BUSINESS = "Southbound Roasters";

const SPRINT = [
  {
    q: "The external environment of a business is best defined as:",
    o: [
      "the departments and staff inside a business that managers control directly",
      "all the factors outside a business that can affect it, and over which the business has little or no control",
      "the building, equipment and premises a business operates from",
      "the section of a business plan that lists start-up costs",
    ],
    a: 1,
    why: "External factors sit outside the business. Managers can respond to them and sometimes influence them, but they cannot control them.",
  },
  {
    q: "Which group belongs to the operating environment rather than the macro environment?",
    o: ["Economic conditions", "Suppliers", "Societal attitudes and behaviour", "Technological developments"],
    a: 1,
    why: "The operating environment is customers, competitors, suppliers and special interest groups. A business deals with these groups directly and can influence them.",
  },
  {
    q: "Suppliers are best described as:",
    o: [
      "the businesses or individuals that provide the materials, stock and resources a business needs to operate",
      "the people who purchase the goods and services a business sells",
      "groups that lobby a business to change its policies",
      "the staff inside a business who place purchase orders",
    ],
    a: 0,
    why: "Suppliers provide inputs. For Southbound Roasters that means green beans, packaging, milk, cups and roasting equipment.",
  },
  {
    q: "Special interest groups include:",
    o: [
      "shareholders, directors and senior managers",
      "lobby groups, unions and industry associations that try to influence business policy or practice",
      "any customer who submits a complaint",
      "government departments that collect tax",
    ],
    a: 1,
    why: "Special interest groups apply pressure from outside. They can shift a plan even though they buy nothing from the business.",
  },
  {
    q: "The Reserve Bank lifts the cash rate and household spending falls. This is an example of:",
    o: ["societal attitudes and behaviour", "economic conditions", "legal and government regulations", "global considerations"],
    a: 1,
    why: "Economic conditions cover interest rates, inflation, unemployment, wage growth and consumer confidence.",
  },
  {
    q: "Which is the clearest example of a corporate social responsibility consideration?",
    o: [
      "Paying employees the legally required minimum wage",
      "Lodging the business activity statement by the due date",
      "Choosing to pay bean growers above the market price when there is no legal requirement to do so",
      "Registering the business name with ASIC",
    ],
    a: 2,
    why: "CSR is what a business does above and beyond what the law requires. The other three options are legal obligations, not CSR.",
  },
  {
    q: "A business is said to have limited control over its operating environment because:",
    o: [
      "it has no contact at all with these groups",
      "it can influence these groups through its own decisions, but it cannot control what they do",
      "the law prevents businesses from negotiating with suppliers",
      "these groups are all located overseas",
    ],
    a: 1,
    why: "Southbound can negotiate contracts with a supplier or run a loyalty offer for customers, but it cannot make either group do what it wants.",
  },
  {
    q: "Competitors are:",
    o: [
      "other businesses that sell rival or substitute goods and services in the same market",
      "the businesses that supply a firm with raw materials",
      "any business operating in Victoria",
      "the internal teams within a business competing for budget",
    ],
    a: 0,
    why: "Competitors shape pricing, product range and location decisions in the plan long before a business opens.",
  },
  {
    q: "Global considerations most directly include:",
    o: [
      "the number of staff a business rosters on a Saturday",
      "exchange rate movements, overseas competition, offshore supply chains and world commodity prices",
      "the layout of a shopfront",
      "the personal savings the owner contributes as capital",
    ],
    a: 1,
    why: "Anything crossing the border sits here. Coffee is imported, so exchange rates and world crop conditions hit Southbound directly.",
  },
  {
    q: "Which is a legal and government regulation a new food business must plan for?",
    o: [
      "Choosing a logo colour",
      "Deciding a staff uniform",
      "Australian Consumer Law obligations and council food premises registration",
      "Selecting which social media platform to use",
    ],
    a: 2,
    why: "Legal and government regulations are compulsory. They set the floor a business plan has to clear before it can trade.",
  },
];

const SORT_ITEMS = [
  { t: "A green bean importer lifts its wholesale price by 12 per cent.", cat: "op", why: "Suppliers sit in the operating environment. Southbound deals with them directly and can renegotiate or switch." },
  { t: "The Reserve Bank raises the cash rate for the third time this year.", cat: "macro", why: "Economic conditions. Broad, national, and completely outside the influence of one roastery." },
  { t: "A national coffee chain opens a drive-through 400 metres away.", cat: "op", why: "Competitors. Direct, local and something Southbound can respond to with pricing or product decisions." },
  { t: "Victoria bans single-use plastic-lined takeaway cups.", cat: "macro", why: "Legal and government regulations. Set by parliament, binding on every business in the state." },
  { t: "A union campaigns publicly over casual rostering in hospitality.", cat: "op", why: "Special interest groups are part of the operating environment. They target businesses directly." },
  { t: "The Australian dollar falls from 68 to 61 US cents.", cat: "macro", why: "Global considerations. Currency movements change the landed cost of every imported bag of beans." },
  { t: "Wholesale cafe clients ask for smaller, more frequent deliveries.", cat: "op", why: "Customers. Their expectations reshape the distribution section of the plan." },
  { t: "Surveys show more Australians are choosing ethically sourced products.", cat: "macro", why: "Societal attitudes and behaviour. A broad shift in values across the population, not one group's demand." },
  { t: "The only compostable cup manufacturer in Victoria has a factory fire.", cat: "op", why: "Suppliers again. Supply disruption is a direct operating environment risk." },
  { t: "New AI roast-profiling software halves the time to develop a blend.", cat: "macro", why: "Technological developments. Available across the industry, not something one business controls." },
  { t: "A frost destroys a large share of the Brazilian arabica crop.", cat: "macro", why: "Global considerations. It reaches Southbound through suppliers, but the cause is a world event." },
  { t: "An environmental group publishes a report on cafe waste and names local roasters.", cat: "op", why: "Special interest groups. Targeted, direct pressure the business must answer." },
  { t: "Unemployment in Melbourne's west falls and local incomes rise.", cat: "macro", why: "Economic conditions. This lifts discretionary spending on takeaway coffee across the whole catchment." },
  { t: "A rival roastery undercuts Southbound's wholesale price by 80 cents a kilogram.", cat: "op", why: "Competitors. Direct rivalry in the same market, and a live pricing decision for the plan." },
];

const CHIPS = [
  "Customers",
  "Competitors",
  "Suppliers",
  "Special interest groups",
  "Legal and government regulations",
  "Societal attitudes and behaviour",
  "Economic conditions",
  "Technological developments",
  "Global considerations",
  "Corporate social responsibility",
];

const FACTOR_ITEMS = [
  { t: "Household incomes in Wyndham rise and more people buy takeaway coffee on weekdays.", a: 6, why: "Economic conditions. Incomes, employment and confidence drive discretionary spending." },
  { t: "A waste-reduction group publicly campaigns against Southbound's use of disposable cups.", a: 3, why: "Special interest groups. Organised pressure aimed at changing a specific business practice." },
  { t: "Southbound installs a roaster that logs bean temperature and moisture automatically.", a: 7, why: "Technological developments. New equipment changes how the business plans production and quality control." },
  { t: "WorkSafe Victoria updates the rules for handling hot equipment in commercial kitchens.", a: 4, why: "Legal and government regulations. Compliance is compulsory and must be budgeted for." },
  { t: "The only supplier of certified compostable cups raises prices by 18 per cent.", a: 2, why: "Suppliers. A single-source input is a serious risk to costings in the plan." },
  { t: "A drought in Vietnam cuts world robusta supply and lifts import prices.", a: 8, why: "Global considerations. An overseas event flows straight through to Southbound's input costs." },
  { t: "More customers say they will pay extra for coffee with a traceable origin.", a: 5, why: "Societal attitudes and behaviour. A shift in what the wider community values." },
  { t: "Southbound decides to donate five per cent of profit to a Wyndham food relief charity, with no requirement to do so.", a: 9, why: "Corporate social responsibility. Voluntary action that goes beyond legal obligations." },
  { t: "A national chain opens a drive-through nearby and prices its flat white 90 cents lower.", a: 1, why: "Competitors. This forces Southbound to justify its price point in the plan." },
  { t: "Two large wholesale cafe clients demand 30-day payment terms instead of 14.", a: 0, why: "Customers. Their demands directly affect the cash flow forecast in the business plan." },
];

const SUPPLIERS = [
  {
    name: "Yarra Bean Traders",
    sub: "Melbourne importer, holds local stock",
    price: "$9.20 / kg",
    lead: "3 days",
    rel: "96%",
    cert: "None",
    trace: "Blended, origin not traced",
  },
  {
    name: "Kopi Nusantara Direct",
    sub: "Indonesian growers co-operative, direct trade",
    price: "$11.80 / kg",
    lead: "28 days",
    rel: "88%",
    cert: "Fairtrade and organic",
    trace: "Single origin, farm level",
  },
  {
    name: "GlobalGreen Commodities",
    sub: "Multinational broker, 2 tonne minimum order",
    price: "$8.40 / kg",
    lead: "14 days",
    rel: "99%",
    cert: "None disclosed",
    trace: "Not available",
  },
];

const SUPPLIER_DECISIONS = [
  {
    q: "Southbound's draft business plan positions the roastery as a premium, ethically sourced, traceable brand aimed at customers who care where their coffee comes from. Which supplier best fits that plan?",
    o: ["Yarra Bean Traders", "Kopi Nusantara Direct", "GlobalGreen Commodities", "Whichever is cheapest, since price decides everything"],
    pts: [10, 20, 0, 0],
    a: 1,
    why: "Supplier choice has to serve the plan, not just the budget. Kopi Nusantara is the only option that delivers the certification and traceability the positioning promises. Yarra Bean earns partial credit for reliability and short lead times, but it cannot back up the ethical claim.",
  },
  {
    q: "Choose the TWO strongest reasons for that supplier decision. (Select two.)",
    multi: 2,
    o: [
      "Certification and farm-level traceability let the business substantiate its marketing claims",
      "The higher price supports a premium price point rather than undermining it",
      "It is the cheapest option per kilogram",
      "It has the shortest lead time of the three",
      "Buying overseas removes all currency risk",
    ],
    correct: [0, 1],
    pts: 20,
    why: "Reasons two and three are simply false for this supplier. A strong justification links the choice back to the stated positioning and the price strategy in the plan.",
  },
  {
    q: "Kopi Nusantara has a 28 day lead time and 88 per cent delivery reliability. Which planning response manages that risk best?",
    o: [
      "Hold a larger safety stock of green beans and keep Yarra Bean Traders as an approved back-up supplier",
      "Switch entirely to GlobalGreen Commodities to remove the risk",
      "Place orders less often so there is less to go wrong",
      "Accept the risk without changing the plan, because certification matters more than supply",
    ],
    pts: [20, 0, 0, 5],
    a: 0,
    why: "A business cannot control a supplier, so the plan manages the exposure instead. Safety stock plus a second approved supplier keeps the ethical positioning and protects continuity of supply.",
  },
  {
    q: "During planning, the Australian dollar falls from 68 to 61 US cents. What does this mean for Southbound, and what should the plan do about it?",
    o: [
      "Nothing changes, because the business pays in Australian dollars",
      "Imported beans become more expensive in Australian dollar terms, so the plan needs a currency buffer in costings and a scheduled price review",
      "Imported beans become cheaper, so the plan should forecast higher profit",
      "The business should stop importing and buy only Australian grown coffee",
    ],
    pts: [0, 20, 0, 5],
    a: 1,
    why: "A weaker Australian dollar raises the cost of imports. This is a global consideration reaching the plan through the cost of goods sold, and it belongs in the financial forecasts as a buffer, not a surprise.",
  },
  {
    q: "A special interest group publishes a report criticising labour conditions on plantations that GlobalGreen buys from. Southbound uses GlobalGreen for its cheaper blend. What is the best planning response?",
    o: [
      "Say nothing publicly and hope the story passes",
      "Publicly blame the broker and take no further action",
      "Introduce a supplier code of conduct, require evidence of compliance, and audit before renewing the contract",
      "Terminate the contract immediately with no replacement supplier arranged",
    ],
    pts: [0, 0, 20, 5],
    a: 2,
    why: "Special interest groups can reshape a plan quickly. A code of conduct with verification protects both the brand and continuity of supply. Terminating with nothing to replace it trades one risk for a worse one.",
  },
];

const CHAIN_EVENTS = [
  {
    title: "Dispatch alert 01",
    text: "The Victorian Government confirms that plastic-lined single-use cups will be banned from 1 July next year.",
    steps: [
      {
        q: "Which external environment factor is this?",
        o: ["Societal attitudes and behaviour", "Legal and government regulations", "Competitors", "Economic conditions"],
        a: 1,
        why: "It is a rule made by government and compliance is compulsory, which makes it a legal and government regulation.",
      },
      {
        q: "What is the most likely impact on Southbound's business planning?",
        o: [
          "The plan must budget for compliant packaging and renegotiate packaging supply before the deadline",
          "The plan can ignore packaging entirely",
          "The business must change its target market",
          "The plan must reduce the number of staff",
        ],
        a: 0,
        why: "Regulation changes usually hit costs and supply arrangements first. Both belong in the financial and operations sections of the plan.",
      },
      {
        q: "Which planning response is strongest?",
        o: [
          "Wait until the ban starts and then look for a supplier",
          "Secure a certified compostable cup supplier early, trial it, and build the higher unit cost into pricing",
          "Stop selling takeaway coffee",
          "Apply for an exemption from the ban",
        ],
        a: 1,
        why: "Acting early turns a compliance cost into a competitive position and avoids paying panic prices in June.",
      },
    ],
  },
  {
    title: "Dispatch alert 02",
    text: "A severe frost in Brazil destroys part of the arabica crop. World prices jump 40 per cent within a month.",
    steps: [
      {
        q: "Which external environment factor is the root cause?",
        o: ["Suppliers", "Global considerations", "Technological developments", "Special interest groups"],
        a: 1,
        why: "The supplier is the channel, but the cause is an overseas event affecting world supply, which makes it a global consideration.",
      },
      {
        q: "What is the most likely impact on the business plan?",
        o: [
          "Input costs rise, which squeezes the profit margins forecast in the plan",
          "Customer numbers automatically fall to zero",
          "The business must change its legal structure",
          "Employee motivation drops",
        ],
        a: 0,
        why: "Higher cost of goods sold flows straight into break-even and profit forecasts.",
      },
      {
        q: "Which planning response manages this best?",
        o: [
          "Absorb the full cost increase indefinitely and change nothing",
          "Contract volume forward with more than one origin and review the wholesale price list",
          "Reduce the quality of the roast without telling customers",
          "Sell the business",
        ],
        a: 1,
        why: "Spreading supply across origins reduces exposure to a single crop failure, and a scheduled price review protects the margin honestly.",
      },
    ],
  },
  {
    title: "Dispatch alert 03",
    text: "A local survey finds 61 per cent of customers now choose a cafe partly on ethical sourcing. Three years ago the figure was 24 per cent.",
    steps: [
      {
        q: "Which external environment factor is this?",
        o: ["Societal attitudes and behaviour", "Legal and government regulations", "Economic conditions", "Suppliers"],
        a: 0,
        why: "A measurable shift in what the wider community values sits under societal attitudes and behaviour.",
      },
      {
        q: "What does this mean for the business plan?",
        o: [
          "The sourcing and marketing sections need to show verified origin, not just claim quality",
          "The plan should remove all reference to sourcing",
          "The business should raise prices without changing anything",
          "The plan needs a new legal structure",
        ],
        a: 0,
        why: "When attitudes shift, unverified claims become a risk. The plan needs evidence behind the promise.",
      },
      {
        q: "Which response best converts this into an opportunity?",
        o: [
          "Advertise more heavily using the word natural",
          "Move to a certified supplier and display farm-level origin information at point of sale",
          "Discount heavily to win price-sensitive customers instead",
          "Do nothing until a competitor moves first",
        ],
        a: 1,
        why: "Certification plus visible origin information gives customers the proof they are now asking for, and it justifies a premium price.",
      },
    ],
  },
  {
    title: "Dispatch alert 04",
    text: "Interest rates rise again. Retail data shows discretionary spending in Melbourne's west has fallen for two consecutive quarters.",
    steps: [
      {
        q: "Which external environment factor is this?",
        o: ["Global considerations", "Economic conditions", "Competitors", "Technological developments"],
        a: 1,
        why: "Interest rates and consumer spending are core economic conditions.",
      },
      {
        q: "What is the most likely impact on the plan?",
        o: [
          "Sales forecasts built on earlier spending levels are likely to be too optimistic",
          "Suppliers will refuse to deliver",
          "The business will be forced to close by regulation",
          "Staff will resign automatically",
        ],
        a: 0,
        why: "Falling discretionary spending undermines the revenue assumptions the whole plan rests on.",
      },
      {
        q: "Which planning response is most appropriate?",
        o: [
          "Revise sales forecasts down and plan an entry-level product at a lower price point",
          "Increase all prices by 20 per cent to protect margin",
          "Expand to a second site immediately",
          "Remove the financial forecasts from the plan",
        ],
        a: 0,
        why: "Realistic forecasts plus an accessible price option keeps volume through a soft period without abandoning the premium range.",
      },
    ],
  },
];

const ORDER_TASKS = [
  {
    prompt: "Explain how one external environment factor could affect Southbound Roasters' business planning.",
    hint: "Structure: define the factor, apply it to the business, explain the impact on planning, then state a response.",
    correct: [
      "Economic conditions refer to the broad state of the economy, including interest rates, employment and consumer confidence, which a business cannot control.",
      "For Southbound Roasters, rising interest rates have reduced discretionary spending across Melbourne's west.",
      "This means the sales forecasts in the business plan, which were based on earlier spending levels, are likely to be too optimistic.",
      "In response, the plan should revise projected sales volumes downwards and introduce a lower priced entry product.",
      "This allows Southbound to keep customer volume through a weaker period while protecting its premium range.",
    ],
  },
  {
    prompt: "Explain how suppliers could affect Southbound Roasters' business planning.",
    hint: "Same structure: define, apply, impact, response, link.",
    correct: [
      "Suppliers are the businesses or individuals that provide a business with the materials and resources it needs to operate.",
      "Southbound Roasters currently relies on a single certified supplier for its compostable takeaway cups.",
      "Because there is no alternative approved supplier, any price rise or delivery failure would directly disrupt the operations and costings set out in the plan.",
      "The plan should therefore approve a second compostable cup supplier and hold a minimum four week buffer stock.",
      "This reduces the risk of a single supplier interrupting trade or forcing an unplanned price increase.",
    ],
  },
];

const RUBRIC = [
  "I defined both external environment factors accurately using business terminology.",
  "I named the correct category for each factor (operating environment or macro environment).",
  "I applied each factor specifically to Southbound Roasters, not to businesses in general.",
  "I explained a clear impact on business planning for each factor, not just a general impact on the business.",
  "I proposed a realistic planning response for each factor.",
  "I wrote at least 200 words in full sentences and paragraphs.",
];

const ROUNDS = [
  { id: "sprint", name: "Terminology sprint", sub: "Ten questions, twenty seconds each. Answer fast for a speed bonus.", mins: 7, max: 140 },
  { id: "sort", name: "Sort the board", sub: "Operating environment or macro environment. Fourteen consignments to clear.", mins: 6, max: 112 },
  { id: "factor", name: "Name that factor", sub: "Ten scenarios. Pick the exact external environment factor at work.", mins: 7, max: 150 },
  { id: "supplier", name: "Supplier showdown", sub: "Choose a green bean supplier and defend the decision.", mins: 9, max: 100 },
  { id: "chain", name: "Impact chain", sub: "Four alerts. Identify the factor, the impact on planning, and the response.", mins: 12, max: 180 },
  { id: "write", name: "Build the response", sub: "Reassemble two model paragraphs, then write your own analysis.", mins: 12, max: 120 },
];

const TOTAL_MAX = ROUNDS.reduce((s, r) => s + r.max, 0);

const TIERS = [
  { min: 0.85, name: "Master roaster", note: "You can define, classify, apply and respond. Take this straight into the SAC." },
  { min: 0.7, name: "Operations lead", note: "Strong control of the content. Tighten the impact-on-planning links and you are there." },
  { min: 0.55, name: "Dispatch crew", note: "The definitions are landing. Practise applying factors to the business rather than describing them." },
  { min: 0.4, name: "Apprentice", note: "Revise the operating and macro categories, then redo rounds two and three." },
  { min: 0, name: "Back to the loading dock", note: "Start with the terminology. Every round after that builds on it." },
];

/* ============================== HELPERS ============================== */

const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const KEYS = ["A", "B", "C", "D", "E"];

function Stamp({ ok }) {
  return <span className={`stamp ${ok ? "ok" : "no"}`}>{ok ? "CLEARED" : "HELD"}</span>;
}

function Docket({ num, title, sub, children, foot }) {
  return (
    <div className="docket">
      <div className="docket-head">
        <div className="num">{num}</div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
      </div>
      <div className="docket-body">{children}</div>
      {foot && <div className="docket-foot">{foot}</div>}
    </div>
  );
}

/* ============================== ROUND 1 ============================== */

function SprintRound({ onDone }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [left, setLeft] = useState(20);
  const [pts, setPts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [lastBonus, setLastBonus] = useState(0);
  const q = SPRINT[i];

  useEffect(() => {
    if (picked !== null) return;
    if (left <= 0) {
      setPicked(-1);
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left, picked]);

  const answer = (idx) => {
    if (picked !== null) return;
    const ok = idx === q.a;
    const bonus = ok ? Math.min(4, Math.ceil(left / 5)) : 0;
    setLastBonus(bonus);
    if (ok) {
      setPts((p) => p + 10 + bonus);
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const n = s + 1;
        setBest((b) => Math.max(b, n));
        return n;
      });
    } else {
      setStreak(0);
    }
    setPicked(idx);
  };

  const next = () => {
    if (i + 1 >= SPRINT.length) {
      onDone({ points: pts, correct, of: SPRINT.length, best });
    } else {
      setI(i + 1);
      setPicked(null);
      setLeft(20);
      setLastBonus(0);
    }
  };

  return (
    <Docket
      num={`ROUND 1 / ITEM ${i + 1} OF ${SPRINT.length}`}
      title="Terminology sprint"
      sub="Twenty seconds each. Answering quickly adds up to four bonus points."
      foot={
        <>
          <span>SCORE {pts}</span>
          <span>STREAK {streak}</span>
          <span style={{ marginLeft: "auto", color: left <= 5 && picked === null ? "#b24a2e" : undefined, fontWeight: 700 }}>
            {picked === null ? `${left}s` : "PAUSED"}
          </span>
        </>
      }
    >
      <p className="qtext">{q.q}</p>
      <div className="opts">
        {q.o.map((o, idx) => {
          let cls = "opt";
          if (picked !== null) {
            if (idx === q.a) cls += " right";
            else if (idx === picked) cls += " wrong";
            if (idx === picked) cls += " picked";
          }
          return (
            <button key={idx} className={cls} disabled={picked !== null} onClick={() => answer(idx)}>
              <span className="key">{KEYS[idx]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <Stamp ok={picked === q.a} />
            {picked === q.a && (
              <span className="metaline">
                +10 base{lastBonus > 0 ? ` and +${lastBonus} speed bonus` : ""}
              </span>
            )}
            {picked === -1 && <span className="metaline">Time expired</span>}
          </div>
          <div className="feedback">
            <strong>Why: </strong>
            {q.why}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-go" onClick={next}>
              {i + 1 >= SPRINT.length ? "Finish round" : "Next item"}
            </button>
          </div>
        </>
      )}
    </Docket>
  );
}

/* ============================== ROUND 2 ============================== */

function SortRound({ onDone }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [pts, setPts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const item = SORT_ITEMS[i];

  const choose = (cat) => {
    if (picked) return;
    const ok = cat === item.cat;
    if (ok) {
      setPts((p) => p + 8);
      setCorrect((c) => c + 1);
    }
    setPicked(cat);
  };

  const next = () => {
    if (i + 1 >= SORT_ITEMS.length) onDone({ points: pts, correct, of: SORT_ITEMS.length });
    else {
      setI(i + 1);
      setPicked(null);
    }
  };

  return (
    <Docket
      num={`ROUND 2 / ITEM ${i + 1} OF ${SORT_ITEMS.length}`}
      title="Sort the board"
      sub="Every consignment belongs in one of two holds. Operating environment groups deal with the business directly. Macro environment factors act on the whole market."
      foot={
        <>
          <span>SCORE {pts}</span>
          <span>CLEARED {correct} / {i + (picked ? 1 : 0)}</span>
        </>
      }
    >
      <div className="card-item">{item.t}</div>
      <div className="bins">
        <button className="bin" disabled={!!picked} onClick={() => choose("op")}>
          OPERATING
          <span>Customers, competitors, suppliers, special interest groups</span>
        </button>
        <button className="bin" disabled={!!picked} onClick={() => choose("macro")}>
          MACRO
          <span>Legal, societal, economic, technological, global, CSR</span>
        </button>
      </div>
      {picked && (
        <>
          <div style={{ marginTop: 18 }}>
            <Stamp ok={picked === item.cat} />
          </div>
          <div className="feedback">
            <strong>{item.cat === "op" ? "Operating environment. " : "Macro environment. "}</strong>
            {item.why}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-go" onClick={next}>
              {i + 1 >= SORT_ITEMS.length ? "Finish round" : "Next consignment"}
            </button>
          </div>
        </>
      )}
    </Docket>
  );
}

/* ============================== ROUND 3 ============================== */

function FactorRound({ onDone }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [pts, setPts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const item = FACTOR_ITEMS[i];

  const choose = (idx) => {
    if (picked !== null) return;
    if (idx === item.a) {
      setPts((p) => p + 15);
      setCorrect((c) => c + 1);
    }
    setPicked(idx);
  };

  const next = () => {
    if (i + 1 >= FACTOR_ITEMS.length) onDone({ points: pts, correct, of: FACTOR_ITEMS.length });
    else {
      setI(i + 1);
      setPicked(null);
    }
  };

  return (
    <Docket
      num={`ROUND 3 / ITEM ${i + 1} OF ${FACTOR_ITEMS.length}`}
      title="Name that factor"
      sub="Fifteen points each. Choose the single factor that best explains what is happening."
      foot={<span>SCORE {pts}</span>}
    >
      <div className="card-item">{item.t}</div>
      <div className="chips">
        {CHIPS.map((c, idx) => {
          let cls = "chip";
          if (picked !== null) {
            if (idx === item.a) cls += " right";
            else if (idx === picked) cls += " wrong";
          }
          return (
            <button key={c} className={cls} disabled={picked !== null} onClick={() => choose(idx)}>
              {c}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          <div style={{ marginTop: 18 }}>
            <Stamp ok={picked === item.a} />
          </div>
          <div className="feedback">
            <strong>{CHIPS[item.a]}. </strong>
            {item.why}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-go" onClick={next}>
              {i + 1 >= FACTOR_ITEMS.length ? "Finish round" : "Next scenario"}
            </button>
          </div>
        </>
      )}
    </Docket>
  );
}

/* ============================== ROUND 4 ============================== */

function SupplierRound({ onDone }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState([]);
  const [locked, setLocked] = useState(false);
  const [pts, setPts] = useState(0);
  const [earned, setEarned] = useState(0);
  const d = SUPPLIER_DECISIONS[i];
  const isMulti = !!d.multi;

  const toggle = (idx) => {
    if (locked) return;
    if (!isMulti) {
      const gain = d.pts[idx];
      setPts((p) => p + gain);
      setEarned(gain);
      setSel([idx]);
      setLocked(true);
      return;
    }
    setSel((s) => (s.includes(idx) ? s.filter((x) => x !== idx) : s.length >= d.multi ? s : [...s, idx]));
  };

  const submitMulti = () => {
    const hits = sel.filter((x) => d.correct.includes(x)).length;
    const gain = hits === 2 ? 20 : hits === 1 ? 10 : 0;
    setPts((p) => p + gain);
    setEarned(gain);
    setLocked(true);
  };

  const next = () => {
    if (i + 1 >= SUPPLIER_DECISIONS.length) onDone({ points: pts, correct: null, of: SUPPLIER_DECISIONS.length });
    else {
      setI(i + 1);
      setSel([]);
      setLocked(false);
      setEarned(0);
    }
  };

  return (
    <Docket
      num={`ROUND 4 / DECISION ${i + 1} OF ${SUPPLIER_DECISIONS.length}`}
      title="Supplier showdown"
      sub={`${BUSINESS} must lock in a green bean supplier before the plan goes to the bank. Read the tender board, then decide.`}
      foot={<span>SCORE {pts}</span>}
    >
      {i === 0 && (
        <div style={{ marginBottom: 20, overflowX: "auto" }}>
          <div className="metaline" style={{ marginBottom: 8 }}>Tender board</div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Price</th>
                <th>Lead time</th>
                <th>Reliability</th>
                <th>Certification</th>
                <th>Traceability</th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((s) => (
                <tr key={s.name}>
                  <td>
                    <strong>{s.name}</strong>
                    <div style={{ fontSize: 12, color: "#7a6f60" }}>{s.sub}</div>
                  </td>
                  <td className="num">{s.price}</td>
                  <td className="num">{s.lead}</td>
                  <td className="num">{s.rel}</td>
                  <td>{s.cert}</td>
                  <td>{s.trace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="qtext">{d.q}</p>
      <div className="opts">
        {d.o.map((o, idx) => {
          let cls = "opt";
          if (!locked && sel.includes(idx)) cls += " sel";
          if (locked) {
            const good = isMulti ? d.correct.includes(idx) : idx === d.a;
            if (good) cls += " right";
            else if (sel.includes(idx)) cls += " wrong";
          }
          return (
            <button key={idx} className={cls} disabled={locked} onClick={() => toggle(idx)}>
              <span className="key">{KEYS[idx]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {isMulti && !locked && (
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-go" disabled={sel.length !== d.multi} onClick={submitMulti}>
            Lock in {sel.length} of {d.multi}
          </button>
        </div>
      )}
      {locked && (
        <>
          <div style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Stamp ok={earned >= (isMulti ? 20 : Math.max(...d.pts))} />
            <span className="metaline">+{earned} points</span>
          </div>
          <div className="feedback">
            <strong>Marker's note: </strong>
            {d.why}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-go" onClick={next}>
              {i + 1 >= SUPPLIER_DECISIONS.length ? "Finish round" : "Next decision"}
            </button>
          </div>
        </>
      )}
    </Docket>
  );
}

/* ============================== ROUND 5 ============================== */

function ChainRound({ onDone }) {
  const [e, setE] = useState(0);
  const [s, setS] = useState(0);
  const [picked, setPicked] = useState(null);
  const [pts, setPts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const ev = CHAIN_EVENTS[e];
  const step = ev.steps[s];
  const labels = ["Identify the factor", "Impact on planning", "Planning response"];

  const choose = (idx) => {
    if (picked !== null) return;
    if (idx === step.a) {
      setPts((p) => p + 15);
      setCorrect((c) => c + 1);
    }
    setPicked(idx);
  };

  const next = () => {
    if (s + 1 < ev.steps.length) {
      setS(s + 1);
      setPicked(null);
    } else if (e + 1 < CHAIN_EVENTS.length) {
      setE(e + 1);
      setS(0);
      setPicked(null);
    } else {
      onDone({ points: pts, correct, of: CHAIN_EVENTS.length * 3 });
    }
  };

  return (
    <Docket
      num={`ROUND 5 / ALERT ${e + 1} OF ${CHAIN_EVENTS.length} / STEP ${s + 1} OF 3`}
      title="Impact chain"
      sub="Every alert runs the same three links: name the factor, state the impact on planning, choose the response. This is exactly the chain a SAC answer needs."
      foot={
        <>
          <span>SCORE {pts}</span>
          <span>LINKS HELD {correct}</span>
        </>
      }
    >
      <div className="card-item">
        <div className="metaline" style={{ marginBottom: 6 }}>{ev.title}</div>
        {ev.text}
      </div>
      <div className="metaline" style={{ marginBottom: 8 }}>Link {s + 1}: {labels[s]}</div>
      <p className="qtext">{step.q}</p>
      <div className="opts">
        {step.o.map((o, idx) => {
          let cls = "opt";
          if (picked !== null) {
            if (idx === step.a) cls += " right";
            else if (idx === picked) cls += " wrong";
          }
          return (
            <button key={idx} className={cls} disabled={picked !== null} onClick={() => choose(idx)}>
              <span className="key">{KEYS[idx]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          <div style={{ marginTop: 18 }}>
            <Stamp ok={picked === step.a} />
          </div>
          <div className="feedback">
            <strong>Why: </strong>
            {step.why}
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn btn-go" onClick={next}>
              {e + 1 === CHAIN_EVENTS.length && s + 1 === ev.steps.length ? "Finish round" : "Next link"}
            </button>
          </div>
        </>
      )}
    </Docket>
  );
}

/* ============================== ROUND 6 ============================== */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.every((v, i) => v === arr[i]) ? [a[1], a[0], ...a.slice(2)] : a;
}

function WriteRound({ onDone }) {
  const [phase, setPhase] = useState(0); // 0,1 = ordering tasks, 2 = extended response
  const [order, setOrder] = useState(() => shuffle(ORDER_TASKS[0].correct));
  const [checkedOrder, setCheckedOrder] = useState(false);
  const [pts, setPts] = useState(0);
  const [essay, setEssay] = useState("");
  const [rubric, setRubric] = useState([]);
  const task = phase < 2 ? ORDER_TASKS[phase] : null;

  const move = (idx, dir) => {
    if (checkedOrder) return;
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const a = [...order];
    [a[idx], a[j]] = [a[j], a[idx]];
    setOrder(a);
  };

  const check = () => {
    const hits = order.filter((line, idx) => line === task.correct[idx]).length;
    setPts((p) => p + hits * 6);
    setCheckedOrder(true);
  };

  const nextPhase = () => {
    if (phase === 0) {
      setPhase(1);
      setOrder(shuffle(ORDER_TASKS[1].correct));
      setCheckedOrder(false);
    } else {
      setPhase(2);
    }
  };

  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const finish = () => {
    const rubricPts = rubric.length * 10;
    onDone({ points: pts + rubricPts, correct: null, of: null, essay, rubric: rubric.length, words });
  };

  if (phase < 2) {
    const hits = checkedOrder ? order.filter((l, i) => l === task.correct[i]).length : 0;
    return (
      <Docket
        num={`ROUND 6 / PARAGRAPH ${phase + 1} OF 2`}
        title="Build the response"
        sub={task.hint}
        foot={<span>SCORE {pts}</span>}
      >
        <div className="card-item" style={{ fontSize: 15 }}>{task.prompt}</div>
        <div className="metaline" style={{ marginBottom: 10 }}>Reorder the sentences. Six points per sentence in the right place.</div>
        {order.map((line, idx) => {
          let cls = "ordrow";
          if (checkedOrder) cls += line === task.correct[idx] ? " right" : " wrong";
          return (
            <div key={line} className={cls}>
              <span className="ordnum">{idx + 1}</span>
              <div className="ordbtns">
                <button disabled={checkedOrder || idx === 0} onClick={() => move(idx, -1)} aria-label="Move up">
                  &#9650;
                </button>
                <button disabled={checkedOrder || idx === order.length - 1} onClick={() => move(idx, 1)} aria-label="Move down">
                  &#9660;
                </button>
              </div>
              <span>{line}</span>
            </div>
          );
        })}
        {!checkedOrder ? (
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-go" onClick={check}>Mark this paragraph</button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 18, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <Stamp ok={hits === task.correct.length} />
              <span className="metaline">{hits} of {task.correct.length} sentences in position, +{hits * 6} points</span>
            </div>
            <div className="feedback">
              <strong>Model order: </strong>
              define the factor, apply it to {BUSINESS}, explain the impact on the plan, give a planning response, then link back to why the response works. Use that same spine in the SAC.
            </div>
            <div style={{ marginTop: 18 }}>
              <button className="btn btn-go" onClick={nextPhase}>
                {phase === 0 ? "Next paragraph" : "Go to the written task"}
              </button>
            </div>
          </>
        )}
      </Docket>
    );
  }

  return (
    <Docket
      num="ROUND 6 / WRITTEN TASK"
      title="Your analysis"
      sub="Ten minutes. Two factors. Write it the way you would write it under SAC conditions."
      foot={<span>WORDS {words}</span>}
    >
      <div className="card-item" style={{ fontSize: 15 }}>
        Analyse how <strong>two</strong> external environment factors could affect the business planning of {BUSINESS}. Use one operating environment factor and one macro environment factor. Refer to the business throughout.
      </div>
      <textarea
        className="ta"
        value={essay}
        onChange={(ev) => setEssay(ev.target.value)}
        placeholder="Start with a definition, then apply it to Southbound Roasters..."
      />
      <div className="metaline" style={{ margin: "18px 0 10px" }}>
        Self-check. Ten points for each statement you can honestly tick. Your teacher can see this response.
      </div>
      {RUBRIC.map((r, idx) => {
        const on = rubric.includes(idx);
        return (
          <button
            key={idx}
            className={`check ${on ? "on" : ""}`}
            onClick={() => setRubric((s) => (s.includes(idx) ? s.filter((x) => x !== idx) : [...s, idx]))}
          >
            <span className="box">{on ? "\u2713" : ""}</span>
            <span>{r}</span>
          </button>
        );
      })}
      <div style={{ marginTop: 18 }}>
        <button className="btn btn-go" disabled={words < 40} onClick={finish}>
          {words < 40 ? "Write at least 40 words to submit" : "Submit and see results"}
        </button>
      </div>
    </Docket>
  );
}

/* ============================== RESULTS ============================== */

function Results({ results, elapsed, board, onAddBoard, onRestart }) {
  const [name, setName] = useState("");
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const total = ROUNDS.reduce((s, r) => s + (results[r.id]?.points || 0), 0);
  const ratio = total / TOTAL_MAX;
  const tier = TIERS.find((t) => ratio >= t.min);

  const badges = [];
  if (results.sprint?.best >= 5) badges.push("Five in a row");
  if (results.sort && results.sort.correct === results.sort.of) badges.push("Zero defects, sorting");
  if (results.factor && results.factor.correct === results.factor.of) badges.push("Every factor named");
  if (results.chain && results.chain.correct >= 10) badges.push("Chain holder");
  if (results.write?.words >= 250) badges.push("Full response written");
  if (elapsed <= 45 * 60 && ratio >= 0.7) badges.push("Ahead of dispatch");

  const summary = `${BUSINESS}: Dispatch result
Name: ${name || "(unnamed)"}
Score: ${total} of ${TOTAL_MAX} (${Math.round(ratio * 100)}%)
Rating: ${tier.name}
Time: ${fmtTime(elapsed)}
${ROUNDS.map((r) => `${r.name}: ${results[r.id]?.points || 0}/${r.max}`).join("\n")}`;

  const copy = () => {
    try {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <Docket num="DISPATCH COMPLETE" title={tier.name} sub={tier.note}>
      <div className="grid2" style={{ marginBottom: 20 }}>
        <div className="statbox">
          <div className="k">Total score</div>
          <div className="v">{total} <span style={{ fontSize: 15, color: "#7a6f60" }}>/ {TOTAL_MAX}</span></div>
        </div>
        <div className="statbox">
          <div className="k">Percentage</div>
          <div className="v">{Math.round(ratio * 100)}%</div>
        </div>
        <div className="statbox">
          <div className="k">Time on task</div>
          <div className="v mono">{fmtTime(elapsed)}</div>
        </div>
      </div>

      <div className="metaline" style={{ marginBottom: 10 }}>Round by round</div>
      {ROUNDS.map((r) => {
        const p = results[r.id]?.points || 0;
        return (
          <div key={r.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600 }}>
              <span>{r.name}</span>
              <span className="mono">{p} / {r.max}</span>
            </div>
            <div className="bar"><i style={{ width: `${Math.min(100, (p / r.max) * 100)}%` }} /></div>
          </div>
        );
      })}

      {badges.length > 0 && (
        <>
          <div className="metaline" style={{ margin: "20px 0 10px" }}>Stamps earned</div>
          <div>{badges.map((b) => <span key={b} className="badge">{b}</span>)}</div>
        </>
      )}

      {results.write?.essay && (
        <>
          <div className="metaline" style={{ margin: "20px 0 8px" }}>
            Your written response ({results.write.words} words, {results.write.rubric} of {RUBRIC.length} self-checks)
          </div>
          <div className="supbox" style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6 }}>{results.write.essay}</div>
          <p className="note">Copy this into your workbook before you close the page. Nothing here is saved.</p>
        </>
      )}

      <div className="metaline" style={{ margin: "24px 0 10px" }}>Class board</div>
      <p className="note" style={{ marginTop: 0 }}>
        This board lives on this device for this session only. Refreshing clears it.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          className="inp"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{ flex: 1, minWidth: 180 }}
        />
        <button
          className="btn btn-lite"
          disabled={!name.trim() || added}
          onClick={() => {
            onAddBoard({ name: name.trim(), total, pct: Math.round(ratio * 100), time: elapsed });
            setAdded(true);
          }}
        >
          {added ? "Added" : "Add my score"}
        </button>
      </div>
      {board.length > 0 && (
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Name</th><th>Score</th><th>%</th><th>Time</th></tr>
          </thead>
          <tbody>
            {[...board].sort((a, b) => b.total - a.total).map((b, i) => (
              <tr key={b.name + i}>
                <td className="num">{i + 1}</td>
                <td>{b.name}</td>
                <td className="num">{b.total}</td>
                <td className="num">{b.pct}%</td>
                <td className="num">{fmtTime(b.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-go" onClick={copy}>{copied ? "Copied" : "Copy my result"}</button>
        <button className="btn btn-ghost" onClick={onRestart}>Run it again</button>
      </div>
    </Docket>
  );
}

/* ============================== INTRO ============================== */

function Intro({ onStart }) {
  return (
    <Docket
      num="PRE-DEPARTURE"
      title="Southbound Roasters: Dispatch"
      sub={`You are the analyst on ${BUSINESS}, a Victorian coffee roasting and wholesale business drafting its business plan. Six rounds, roughly fifty minutes, every answer marked and explained.`}
    >
      <div className="metaline" style={{ marginBottom: 10 }}>The run sheet</div>
      <table className="tbl" style={{ marginBottom: 20 }}>
        <thead>
          <tr><th>Round</th><th>What you do</th><th>Time</th><th>Points</th></tr>
        </thead>
        <tbody>
          {ROUNDS.map((r, i) => (
            <tr key={r.id}>
              <td><strong>{i + 1}. {r.name}</strong></td>
              <td style={{ color: "#5c5245" }}>{r.sub}</td>
              <td className="num">{r.mins} min</td>
              <td className="num">{r.max}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}><strong>Total</strong></td>
            <td className="num"><strong>53 min</strong></td>
            <td className="num"><strong>{TOTAL_MAX}</strong></td>
          </tr>
        </tbody>
      </table>
      <div className="feedback">
        <strong>Before you start. </strong>
        Round 1 is the only timed round, at twenty seconds per question. Everything else runs at your own pace, but the clock at the top is always counting. Read the feedback after each answer, that is where most of the revision happens. Nothing is saved when you close the page, so copy your written response out at the end.
      </div>
      <div style={{ marginTop: 22 }}>
        <button className="btn btn-go" onClick={onStart}>Start the run</button>
      </div>
    </Docket>
  );
}

/* ============================== APP ============================== */

export default function App() {
  const [stage, setStage] = useState("intro");
  const [ri, setRi] = useState(0);
  const [results, setResults] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    if (stage !== "run") return;
    const t = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);

  const total = ROUNDS.reduce((s, r) => s + (results[r.id]?.points || 0), 0);

  const finishRound = useCallback(
    (id) => (payload) => {
      setResults((r) => ({ ...r, [id]: payload }));
      setRi((i) => {
        if (i + 1 >= ROUNDS.length) {
          setStage("done");
          return i;
        }
        return i + 1;
      });
    },
    []
  );

  const restart = () => {
    setResults({});
    setRi(0);
    setElapsed(0);
    setStage("intro");
  };

  const current = ROUNDS[ri];

  return (
    <div className="sbr">
      <style>{CSS}</style>

      <div className="strip">
        <div className="strip-in">
          <div className="brand">
            <span className="mark">SBR</span>
            <span className="nm">DISPATCH</span>
          </div>
          <div className="gauge">
            <div className="lab">Score</div>
            <div className="val hot">{total}</div>
          </div>
          <div className="gauge">
            <div className="lab">Round</div>
            <div className="val">{stage === "run" ? `${ri + 1}/6` : stage === "done" ? "6/6" : "-"}</div>
          </div>
          <div className="gauge">
            <div className="lab">Elapsed</div>
            <div className="val mono">{fmtTime(elapsed)}</div>
          </div>
        </div>
      </div>

      {stage !== "intro" && (
        <div className="rail">
          {ROUNDS.map((r, i) => (
            <div className="rail-seg" key={r.id}>
              <div className={`rail-bar ${i < ri || stage === "done" ? "done" : i === ri ? "now" : ""}`} />
              <div className={`rail-lab ${i === ri && stage === "run" ? "now" : ""}`}>{i + 1}</div>
            </div>
          ))}
        </div>
      )}

      <div className="wrap">
        {stage === "intro" && (
          <>
            <Intro onStart={() => setStage("run")} />
            <details className="teach">
              <summary>Teacher notes</summary>
              <ul>
                <li>Built for VCE Business Management Unit 1, external business environment and planning. Under the 2023 to 2027 study design this content sits in Area of Study 3, so check the numbering against your school's sequence before you hand it out.</li>
                <li>Covers the operating environment (customers, competitors, suppliers, special interest groups) and the macro environment (legal and government regulations, societal attitudes and behaviour, economic conditions, technological developments, global considerations, corporate social responsibility considerations).</li>
                <li>Suggested run: one period. Round 1 is timed at twenty seconds per item, the rest are self-paced. Total run time is about fifty three minutes.</li>
                <li>Rounds 1 to 5 are fully auto-marked. Round 6 gives auto-marked sentence ordering plus a written response that appears on the results screen for you to read and mark properly.</li>
                <li>The round by round bars on the results screen show you where the class is weak. Low round 2 means the operating and macro split has not landed. Low round 5 means students can name factors but cannot link them to planning, which is the usual SAC problem.</li>
                <li>Nothing is stored. Students should copy their result and their written response before closing the tab.</li>
              </ul>
            </details>
          </>
        )}

        {stage === "run" && current.id === "sprint" && <SprintRound key="sprint" onDone={finishRound("sprint")} />}
        {stage === "run" && current.id === "sort" && <SortRound key="sort" onDone={finishRound("sort")} />}
        {stage === "run" && current.id === "factor" && <FactorRound key="factor" onDone={finishRound("factor")} />}
        {stage === "run" && current.id === "supplier" && <SupplierRound key="supplier" onDone={finishRound("supplier")} />}
        {stage === "run" && current.id === "chain" && <ChainRound key="chain" onDone={finishRound("chain")} />}
        {stage === "run" && current.id === "write" && <WriteRound key="write" onDone={finishRound("write")} />}

        {stage === "done" && (
          <Results
            results={results}
            elapsed={elapsed}
            board={board}
            onAddBoard={(e) => setBoard((b) => [...b, e])}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
