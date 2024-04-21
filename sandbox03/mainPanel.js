(function(){
  const downloadFromDevToolButtonElem = document.getElementById("downloadFromDevToolButton")
  const downloadFromContentsButtonElem = document.getElementById("downloadFromContentsButton")
  
  // 検出したページのtabId
  // これじゃなくてもアクティブなTabIdでいいかも
  const inspectedWindowTabId = chrome.devtools.inspectedWindow.tabId;

  //---------------------------------------
  // devtoolのパネルからファイルをダウンロードさせる。
  downloadFromDevToolButtonElem.addEventListener("click", () => {
    const contents = JSON.stringify({
      value01: "bbb",
      value02: 123,
    })
    
    const blob = new Blob([contents], { type: "application/json" });
    const filename =  `devtool-${Date.now()}.json`

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();

    URL.revokeObjectURL(url);
  })

  // コンテンツページからダウンロード
  downloadFromContentsButtonElem.addEventListener("click", async () => {
    // "host_permissions": ["https://github.com/*"] などを追加
    // ↑アクティブなタブでやる場合も必要なのかな？
    await chrome.scripting.executeScript({
      target: { tabId: inspectedWindowTabId },
      files: ["./contents/downloadFile.js"],
    });
  })

  //---------------------------------------
  const collectRepositoriesButtonElem = document.getElementById("collectRepositoriesButton")
  const repositoresAreaElem = document.getElementById("repositoresArea")

  /**
   * コンテンツページからリポジトリの一覧を取得する。
   * @returns 
   */
  async function collectRepositories() {

    // 対象のタブに対してスクリプトを実行する。
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: inspectedWindowTabId },
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
  
  /**
   * リポジトリの情報のダウンロード
   * @param {*} repo 
   */
  function downloadRepoInfo(repo) {
    // コンテンツページのダウンロード対象のノードを取得
    const repositoriesNodes = document.querySelectorAll(
      `#user-repositories-list li h3 a[href="${repo.url.replaceAll('https://github.com', '')}"]`
    );
    const repoNode = repositoriesNodes[0]
    
    // ダウンロードする内容
    const contents = JSON.stringify({
      innerText: repoNode.innerText,
      innerHTML: repoNode.innerHTML,
      href: repoNode.href
    })
    const blob = new Blob([contents], { type: "application/json" });
    const filename = `repoInfo-${Date.now()}.json`;
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
  
    URL.revokeObjectURL(url);
  }
  
  collectRepositoriesButtonElem.addEventListener("click", async () => {
    removeAllChildren(repositoresAreaElem);
    
    const repositories = await collectRepositories();

    if (repositories.length === 0) {
      const text = document.createElement("span");
      text.textContent = "リポジトリはありません。";
      repositoresAreaElem.appendChild(text);
      return;
    }

    const div = document.createElement("div");
    div.classList.add("collection")
    repositoresAreaElem.appendChild(div);

    for (const repo of repositories) {
      const a = document.createElement("a");
      div.appendChild(a);

      a.textContent = repo.name;
      a.classList.add("collection-item")
      a.href="#"
      // クリック時はコンテンツページ側でダウンロードする。
      // argsを使うにはfuncにする必要がある。
      a.onclick = () => {
        chrome.scripting.executeScript({
          target: { tabId: inspectedWindowTabId },
          func: downloadRepoInfo,
          args : [ repo ],
        });
        return false
      }
    }
  });

})()