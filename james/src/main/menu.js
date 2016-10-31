import { shell, Menu } from 'electron';

function menuTemp1() {
  const menu = [];
  menu.push({
    label: 'James',
    submenu: [
      {
        label: 'About James',
        click: function() {
          shell.openExternal('https://github.com/james-proxy/james');
        }
      }
    ]
  });

  return menu;
}

export default function createMenu() {
  const menu = Menu.buildFromTemplate(menuTemp1());
  Menu.setApplicationMenu(menu);
}