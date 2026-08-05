// Registers the Proxima Nova brand font on web by injecting its @font-face
// declarations (mirrors assets/fonts/proxima-nova.css). The actual font files
// must be served at the referenced /fonts/ProximaNova/... paths; until they are,
// brand text falls back to the system stack automatically.
const CSS = `
@font-face {
  font-family: "ProximaNovaBlack";
  src: url("/fonts/ProximaNova/ProximaNovaBlack/ProximaNovaBlack.eot");
  src: url("/fonts/ProximaNova/ProximaNovaBlack/ProximaNovaBlack.eot?#iefix") format("embedded-opentype"),
       url("/fonts/ProximaNova/ProximaNovaBlack/ProximaNovaBlack.woff") format("woff"),
       url("/fonts/ProximaNova/ProximaNovaBlack/ProximaNovaBlack.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
  font-display: swap;
}
@font-face {
  font-family: "ProximaNovaBold";
  src: url("/fonts/ProximaNova/ProximaNovaBold/ProximaNovaBold.eot");
  src: url("/fonts/ProximaNova/ProximaNovaBold/ProximaNovaBold.eot?#iefix") format("embedded-opentype"),
       url("/fonts/ProximaNova/ProximaNovaBold/ProximaNovaBold.woff") format("woff"),
       url("/fonts/ProximaNova/ProximaNovaBold/ProximaNovaBold.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
  font-display: swap;
}
@font-face {
  font-family: "ProximaNovaRegular";
  src: url("/fonts/ProximaNova/ProximaNovaRegular/ProximaNovaRegular.eot");
  src: url("/fonts/ProximaNova/ProximaNovaRegular/ProximaNovaRegular.eot?#iefix") format("embedded-opentype"),
       url("/fonts/ProximaNova/ProximaNovaRegular/ProximaNovaRegular.woff") format("woff"),
       url("/fonts/ProximaNova/ProximaNovaRegular/ProximaNovaRegular.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
  font-display: swap;
}
@font-face {
  font-family: "ProximaNovaSemibold";
  src: url("/fonts/ProximaNova/ProximaNovaSemibold/ProximaNovaSemibold.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
  font-display: swap;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('proxima-nova-font')) {
  const style = document.createElement('style');
  style.id = 'proxima-nova-font';
  style.textContent = CSS;
  document.head.appendChild(style);
}

// Roboto Flex (used by the onboarding titles) — loaded from Google Fonts.
if (typeof document !== 'undefined' && !document.getElementById('roboto-flex-font')) {
  const link = document.createElement('link');
  link.id = 'roboto-flex-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@400..700&display=swap';
  document.head.appendChild(link);
}
