import { createEmbeddedApp } from "./sdk";

const $app = document.querySelector("#app") as HTMLDivElement;

async function main() {
  const app = await createEmbeddedApp<{ count: number }>({ debug: true });
  (window as any).app = app;
  app.ensureState({ count: 0 });

  const $button = document.createElement("button");
  $app.appendChild($button);

  $button.onclick = function increment() {
    app.setState({ count: app.state.count + 1 });
  };

  function renderApp() {
    $button.textContent = `count: ${app.state.count}`;
  }
  app.onStateChanged.addListener(renderApp);
  renderApp();

  console.log(app.meta);
}

main().catch(console.error);
