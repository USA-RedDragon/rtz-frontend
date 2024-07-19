import 'cypress-mochawesome-reporter/register';
import { registerCommand } from 'cypress-wait-for-stable-dom';

registerCommand();

Cypress.on("window:before:load", win => {
  win.indexedDB.deleteDatabase("localforage");
});
