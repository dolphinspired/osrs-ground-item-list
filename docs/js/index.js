const config = {
  buttonChangeTimeout: 2000,

  filteredListUrl: 'https://raw.githubusercontent.com/dolphinspired/osrs-ground-item-list/main/Filtered.txt',
  highlightedListUrl: 'https://raw.githubusercontent.com/dolphinspired/osrs-ground-item-list/main/Highlighted.txt',

  filteredCodeId: 'filtered-items-code-block',
  filteredCopyId: 'filtered-items-copy-button',
  filteredResetId: 'filtered-items-reset-button',
  highlightedCodeId: 'highlighted-items-code-block',
  highlightedCopyId: 'highlighted-items-copy-button',
  highlightedResetId: 'highlighted-items-reset-button',

  cache: {},
};

function setTempButtonStyle(evt, message, fromClassName, toClassName) {
  const button = evt.target;
  const origMessage = button.innerText;

  button.innerText = message;
  button.classList.remove(fromClassName);
  button.classList.add(toClassName);
  button.setAttribute('disabled', 'disabled');

  setTimeout(() => {
    button.innerText = origMessage;
    button.classList.remove(toClassName);
    button.removeAttribute('disabled');
    button.classList.add(fromClassName);
  }, config.buttonChangeTimeout)
}

function getCopyButtonOnClick(textAreaId) {
  return (evt) => {
    const textarea = document.getElementById(textAreaId);
    const contents = textarea.value
      .replaceAll('\r', '')
      .replaceAll('\n', '')
      .replaceAll('  ', '');

    navigator.clipboard.writeText(contents).then(
      () => setTempButtonStyle(evt, 'Copied!', 'btn-primary', 'btn-success'),
      () => setTempButtonStyle(evt, 'Copy failed!', 'btn-primary', 'btn-danger')
    );
  }
}

function getResetButtonOnClick(textAreaId) {
  return (evt) => {
    const textarea = document.getElementById(textAreaId);
    textarea.value = config.cache[textAreaId];

    setTempButtonStyle(evt, 'Reset!', 'btn-secondary', 'btn-success');
  }
}

function downloadLists() {
  fetch(config.filteredListUrl)
    .then((res) => res.text())
    .then((text) => {
      config.cache[config.filteredCodeId] = text;

      const textarea = document.getElementById(config.filteredCodeId);
      textarea.value = text;
    });

  fetch(config.highlightedListUrl)
    .then((res) => res.text())
    .then((text) => {
      config.cache[config.highlightedCodeId] = text;

      const textarea = document.getElementById(config.highlightedCodeId);
      textarea.value = text;
    });
}

function setupEvents() {
  const filteredItemsCopyButton = document.getElementById(config.filteredCopyId);
  filteredItemsCopyButton.onclick = getCopyButtonOnClick(config.filteredCodeId);

  const filteredItemsResetButton = document.getElementById(config.filteredResetId);
  filteredItemsResetButton.onclick = getResetButtonOnClick(config.filteredCodeId);

  const highlightedItemsCopyButton = document.getElementById(config.highlightedCopyId);
  highlightedItemsCopyButton.onclick = getCopyButtonOnClick(config.highlightedCodeId);

  const highlightedItemsResetButton = document.getElementById(config.highlightedResetId);
  highlightedItemsResetButton.onclick = getResetButtonOnClick(config.highlightedCodeId);
}

function init() {
  downloadLists();
  setupEvents();
}