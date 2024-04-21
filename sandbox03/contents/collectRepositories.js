(function () {
  function collectRepositories() {
    const repositoriesNodes = document.querySelectorAll(
      "#user-repositories-list li h3 a"
    );
    const repositories = [...repositoriesNodes].map((n) => ({
      name: n.innerText,
      url: n.href,
    }));
    return repositories;
  }

  return collectRepositories();
})();