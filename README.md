# Custom POS Keyboard Shortcut

[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![Odoo 13.0](https://img.shields.io/badge/Odoo-13.0-lightgrey)](https://www.odoo.com)

## Description

`custom_pos_keyboard_shortcut` adds a set of configurable keyboard shortcuts to the Odoo Point of Sale (POS) interface.  The goal is to speed up the workflow of desktop‑oriented cashiers by allowing common actions (new order, product search, help, etc.) to be triggered without leaving the keyboard.

## Features

- **Extensible shortcut system** – shortcuts are defined in JavaScript and can be extended by other modules.
- **Three‑column POS layout** – optimized for desktop screens.
- **Focus management** – the product search field receives focus automatically when the POS loads; arrow keys navigate the product list.
- **Help overlay** – press `F2` to display a printable list of all shortcuts.
- **Future‑proof design** – the UI is responsive and ready for additional shortcuts or configuration options.

## Installation

1. **Copy the addon** into your Odoo 13 addons directory (e.g. `/opt/odoo/addons`).
2. **Update the Odoo configuration** to include the new path if it is not already in `addons_path`.
3. **Restart the Odoo server**.
4. **Activate the module** via the Apps menu → *Custom POS Keyboard Shortcut* → *Install*.

```bash
# Example (adjust paths as needed)
cp -r custom_pos_keyboard_shortcut /opt/odoo/addons/
# Restart Odoo (systemd service name may vary)
sudo systemctl restart odoo
```

## Configuration

At the moment the addon is **always active** – there is no UI switch in Odoo Settings.  Future releases will expose a configuration panel to enable/disable individual shortcuts.

## Usage

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | Create a **New Order**.
| `Tab`    | Move focus to the **product search** field.
| `F2`     | Open the **Shortcut Help** overlay.
| Arrow keys (`↑ ↓ ← →`) | Navigate the **product list**.

1. When the POS loads, the search field is automatically focused.
2. Press `Tab` to ensure the focus is on the search bar, then type the product name.
3. Use the defined shortcuts to perform actions without clicking the UI.

## Development

- **Odoo version:** 13.0
- **Language:** Python (manifest) + JavaScript (frontend).
- **Folder structure**
  - `static/src/js/screens.js` – main JavaScript implementation.
  - `static/src/xml/pos.xml` – QWeb templates.
  - `views/assets.xml` – web assets registration.

### Running Tests

Future work will include unit and integration tests for the JavaScript shortcut handling.  When they are added, run them with the Odoo testing framework:

```bash
odoo -d test_db -i custom_pos_keyboard_shortcut --test-enable
```

## Contributing

Contributions are welcome!  Please follow the Odoo development guidelines:
1. Fork the repository.
2. Create a feature branch.
3. Ensure the code adheres to the existing style and passes linting.
4. Submit a Pull Request with a clear description of the change.

## License

LGPL‑3 (see `LICENSE` file).

## Authors & Maintainers

- **Abdullah Al Arafat Bipul** – <imbipul9@gmail.com>
- **Website:** [http://www.scorpion9.com](http://www.scorpion9.com)

---

*Generated automatically by Antigravity.*
