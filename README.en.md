# GGTECH

[Português](README.md) · **English**

**Gabriel Guimarães · Interface Development · UniCEUB, 2026**

I made GGTECH to help people build their first PC. You can look inside a 3D case, learn what each part does, and try out a build before you think about buying it. The guided builder gives you a place to start. If you already have a few parts in mind, you can go straight to the catalog or the manual builder. The site and project notes are in Portuguese.

## Open either version

- **First submission.** It has a 3D PC case with four groups of parts, 20 sample products, a theme switch, and a slideshow. [Open the first version](https://gabrielguimaraes07.github.io/Trabalho_final_di/entrega-parcial/) · [First version files](entrega-parcial/)
- **Final version.** It has 62 real products in 19 categories, 16 ready-made builds, a guided and a manual builder, part comparisons, a guide, a glossary, a cart, and accessibility settings. [Open the final site](https://gabrielguimaraes07.github.io/Trabalho_final_di/entrega-final/index.html?versao=5385b5f) · [Final files](entrega-final/)

![GGTECH home page with the sidebar, soft gradient, and interactive PC case](entrega-final/docs/capturas/apresentacao-inicio.jpg)

[PC case](entrega-final/docs/capturas/apresentacao-gabinete.jpg) · [Glossary](entrega-final/docs/capturas/apresentacao-glossario.jpg) · [Product catalog](entrega-final/docs/capturas/apresentacao-catalogo.jpg) · [Guided builder](entrega-final/docs/capturas/apresentacao-montador.jpg) · [Manual builder](entrega-final/docs/capturas/apresentacao-simulador.jpg) · [Mobile home page](entrega-final/docs/capturas/apresentacao-celular.jpg) · [Accessibility settings](entrega-final/docs/capturas/apresentacao-acessibilidade.jpg)

## How the site came together

### 1. The first page

I started with `index.html` and set up the header, navigation, main content, and footer. At the top, I put the two ways to start a build next to the 3D case. The part cards, carousel, and ready-made builds sit farther down the page. The **Pular para o conteúdo** (Skip to content) link takes keyboard users straight to the main content.

I used plain CSS and split the styles by what they do. `tokens.css` holds the colors for both themes, text sizes, and spacing so a button can look the same on the home page and in the catalog. The project bundles DM Sans and uses a slate-blue gradient in dark mode, with porcelain-blue controls and brass accents. The light G on a slate-blue square identifies the project in the header and browser tab. `layout.css` handles page structure, and `navegacao.css` styles the sidebar. [Color palette](entrega-final/docs/paleta.md) · [Color psychology](entrega-final/docs/psicologia-cores.md)

### 2. The 3D PC case

`modelo-pc.js` builds the case and its parts from Three.js shapes and materials. `cena3d.js` figures out which part you clicked and moves the camera toward it, slowing down as it gets close. The catalog then opens on the right on a computer and below the model on a phone. It shows photos, prices, and a link to use a part in the manual builder.

You can turn the case with a mouse, touch, or the arrow keys. Automatic rotation pauses while you explore and resumes after a few seconds of inactivity. The **Pausar giro** (Pause rotation) button keeps the case still until you choose to resume. Use the zoom buttons or **Restaurar vista** (Reset view) to adjust the framing. The part buttons still work with the fallback image if WebGL is unavailable. In **Por dentro do seu PC** (Inside your PC), scrolling or using the slider pulls the parts apart so you can see where they fit.

### 3. The first examples

I added short explanations to the home page cards. RAM, for example, works like a desk where you keep the things you are using. The component guide goes further with models, photos, and prices. The glossary explains terms like *socket* and DDR in short definitions. Search by name or abbreviation, and open **Ver mais** (Read more) for examples and extra details.

Codex helped me organize the setup photos and connect the carousel arrows, slide indicators, and pause button. Each photo comes with a practical detail, like turning a second monitor vertically or leaving room for a notebook. I also fixed controls that were hidden behind the menu when using Tab. [Review of the first submission](entrega-final/docs/revisao-parcial.md)

### 4. The menu, login, and reading options

On desktop, navigation stays fixed on the left. You can collapse it to icons and read the labels on hover or keyboard focus. Sign-in, accessibility, and the cart stay together in the header. The footer also links to **Contato** (Contact), where you'll find the form and frequently asked questions. On a phone, use the **Menu** button to open and close navigation. Codex helped me connect the home page to the sidebar, set up the tabs and messages for the demo login, and validate the contact form. [Sign in](entrega-final/docs/capturas/apresentacao-login.jpg) · [Contact](entrega-final/docs/capturas/apresentacao-contato.jpg)

Codex also helped me build the accessibility panel. You can switch between light and dark themes, make the text bigger, change spacing, increase contrast, and underline links. The preview shows the changes right away, and the browser saves your choices. With **Reduzir movimento** (Reduce motion) on, the case and carousel stop moving automatically, and the camera goes straight to the selected part. [Interface choices](entrega-final/docs/ihc-ux-ui.md)

### 5. Real products

I replaced the sample products with real models. Each part has a photo, brand, model name, reference price, and specs. `produtos.json` also stores the details the builder checks, like CPU socket, memory type, power supply wattage, and graphics card size.

The catalog, guide, cart, and saved builds all use the same product ID. That way, a ready-made build can open with the same models you see in search. The product photos are included with the final version's other assets. [Product data](entrega-final/dados/produtos.json)

### 6. Search and comparisons

The catalog uses the product data to fill the category tabs, search suggestions, and product cards. Filters sit on the left on a computer and in a collapsible panel on a phone. The results show the count, active filters, and a clear option. Search by name works alongside the brand, price, and compatibility filters. In **Armazenamento** (Storage), for example, **Tipo de peça** (Part type) separates SATA SSDs, NVMe SSDs, and hard drives.

Open **Ver detalhes** (View details) on a card to see its specs. **Usar na montagem** (Use in build) opens the part in the manual builder. To compare, mark **Comparar** (Compare) on up to three models of the same type and open **Ver comparação** (View comparison). You can see specs and prices side by side or check which CPUs have integrated graphics. [Nielsen's usability principles in GGTECH](entrega-final/docs/heuristicas-nielsen.md)

### 7. Two ways to build a PC

I set up the guided builder around three questions. Choose what the PC is for first, set your budget next, and then pick a priority from savings, performance, or RGB lighting. The builder looks for a set of parts that fits your answers and tells you if the budget is below the minimum for that use. The result explains the suggestion and shows separate subtotals for the PC and its accessories.

Open **Montagem manual** (Manual builder) to start from scratch. If you have a suggestion from the guided builder, choose **Personalizar na montagem manual** (Customize in the manual builder). On a ready-made build, open **Ver lista de peças** (View parts list) and then choose **Personalizar montagem** (Customize build). The ready-made builds use the same products as the catalog, so you can start with one and swap only the parts you need.

In the manual builder, choose a category, pick a part, and check the summary before moving on. Open **Periféricos opcionais** (Optional accessories) to find items like monitors, keyboards, and mice. The build preview shows photos of the parts you picked. The summary updates quantities, subtotals, and estimated power use.

Open **Salvar, abrir ou comparar** (Save, open or compare) in the summary to name and save the list, reopen an older build, or compare it with the current one. **Compartilhar link** (Share link) lets you open the parts list in another browser, and **Exportar PDF** (Export PDF) opens the print dialog.

### 8. Compatibility checks and the cart

`compatibilidade.js` checks the catalog data for CPU and motherboard socket, supported memory and slots, and room for the graphics card, among other things. It also checks power and connections. In the MSI MAG PANO M100R PZ case, for example, SATA SSDs and hard drives share a mounting space. The builder warns you if you pick too many.

On a phone, **Ver montagem** (View build) takes you straight to the summary. Check the essential parts and any warnings, then move the build to the cart. There you can review the items, change quantities, and check the total. **Simular compra** (Simulate purchase) opens one last review before you confirm.

### 9. Testing

Testing covered keyboard navigation, large and small screens, text at 200%, and color contrast. It also covered part comparisons, the cart, and opening and saving builds. The latest Chromium checks covered widths from 320 to 1,440 px. They included keyboard navigation, the case with a mouse and simulated touch, filters, the glossary, the bundled font, theme switching, reduced motion, and the image fallback without WebGL. [Project tests](entrega-final/docs/auditoria.md) · [Current contrast results](entrega-final/docs/wcag-contraste.md) · [How I used AI](entrega-final/docs/registro-ia.md)

## Run the site on your computer

1. On GitHub, open **Code** and choose **Download ZIP**. Unzip the folder and open it in VS Code.
2. Choose `entrega-final/index.html` or `entrega-parcial/index.html`. With the Live Server extension installed, right-click the file and select **Open with Live Server**.

If you prefer Python, open a terminal in the folder that contains `entrega-parcial/` and `entrega-final/` and run the following command.

```sh
python -m http.server 8765
```

The local server helps the browser load the product data and JavaScript modules. The first version loads Three.js over the internet. The final version includes it with the project files. Once the server is running, open either version in your browser. [First version on localhost](http://localhost:8765/entrega-parcial/) · [Final version on localhost](http://localhost:8765/entrega-final/)

## Where to find the code

- **HTML.** `index.html` is the home page, `estoque.html` is the catalog, `montador.html` is the guided builder, and `simulador.html` is the manual builder. The pages live inside each version's folder.
- **CSS.** `css/` holds the styles. `tokens.css` holds the palette and loads DM Sans. `layout.css` handles the page structure and footer, `navegacao.css` styles the sidebar, and `laboratorio.css` handles the visual refinements.
- **JavaScript.** In `js/`, `principal.js` starts each page's features. Look in `cena3d.js` for the 3D clicks, `pagina-estoque.js` for the catalog filters, and `compatibilidade.js` for the compatibility checks.
- **Data.** `dados/` holds the products, ready-made builds, and glossary.
- **Images and libraries.** These are in `recursos/`. Three.js draws the case, and GSAP helps animate section headings as they enter the view. [Code guide](entrega-final/docs/codigo.md)

## Good to know before you try it

The prices give you a rough idea of what the PC would cost. They're in Brazilian reais, without shipping, and some deals have already ended. If you plan to build the PC, check the manufacturer specs for details like the BIOS version, room for cables, and radiator placement. The build photos give you a sense of where the parts go, and the activity list uses the specs to give you a rough estimate of what the PC can handle.

Sign-in, the contact form, and checkout are there so you can try how they work. The cart, accessibility options, and saved builds stay in the browser you used. [Photo credits and references](entrega-final/docs/referencias.md)
