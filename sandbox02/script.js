(function () {
  const collectRepositoriesElem = document.getElementById(
    "collectRepositories"
  );
  const repositoresAreaElem = document.getElementById("repositoresArea");

  async function getActiveTab() {
    // queryを使ってタブの情報を取得できる(今回はアクティブタブを取得)
    const tabs = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    // 配列で返ってくるので先頭
    const activeTab = tabs[0];
    return activeTab;
  }

  async function collectRepositories() {
    const activeTab = await getActiveTab();
    const activeTabId = activeTab.id;

    // 対象のタブに対してスクリプトを実行する。
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      files: ["./contents/collectRepositories.js"],
    });
    const result = injectionResults[0].result;
    return result;
  }

  function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  collectRepositoriesElem.addEventListener("click", async () => {
    removeAllChildren(repositoresAreaElem);
    
    const repositories = await collectRepositories();

    if (repositories.length === 0) {
      const text = document.createElement("span");
      text.textContent = "リポジトリはありません。";
      repositoresAreaElem.appendChild(text);
      return;
    }

    const ul = document.createElement("ul");
    repositoresAreaElem.appendChild(ul);

    for (const repo of repositories) {
      const li = document.createElement("li");
      ul.appendChild(li);

      const link = document.createElement("a");
      link.textContent = repo.name;
      link.href = repo.url;
      link.target = "_blank";
      li.appendChild(link);
    }
  });
})();
