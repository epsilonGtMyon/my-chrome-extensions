(function () {

  chrome.devtools.panels.create(
    "Sandbox03",
    null,
    "./mainPanel.html",
    (panel) => {
      // noop
    }
  );
})();
