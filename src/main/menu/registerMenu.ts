import { app, Menu, MenuItemConstructorOptions } from "electron";

export function registerMenu() {
  const isMac = process.platform === "darwin";
  const separator = "separator" as "separator";

  // Based on https://github.com/electron/electron/blob/master/docs/api/menu.md
  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.getName(),
            submenu: [
              { role: "about" },
              { type: separator },
              { role: "services" },
              { type: separator },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: separator },
              { role: "quit" }
            ]
          }
        ]
      : []),
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: separator },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: separator },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
              }
            ]
          : [{ role: "delete" }, { type: separator }, { role: "selectAll" }])
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: separator },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: separator },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [{ type: separator }, { role: "front" }, { type: separator }, { role: "window" }]
          : [{ role: "close" }])
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
