(function () {
  
  const contents = JSON.stringify({
    value01: "bbbb",
    value02: 1234,
  })
  const blob = new Blob([contents], { type: "application/json" });
  const filename = `contents-${Date.now()}.json`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = filename;
  a.href = url;
  a.click();

  URL.revokeObjectURL(url);
})();
