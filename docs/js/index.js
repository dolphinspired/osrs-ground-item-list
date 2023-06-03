const buttonChangeTimeout = 2000;
const busyClass = 'do-not-disturb';

function setTempButtonStyle(evt, message, fromClassName, toClassName) {
  const button = evt.target;
  const origMessage = button.innerText;

  button.innerText = message;
  button.classList.remove(fromClassName);
  button.classList.add(toClassName);
  button.classList.add(busyClass);

  setTimeout(() => {
    button.innerText = origMessage;
    button.classList.remove(toClassName);
    button.classList.remove(busyClass);
    button.classList.add(fromClassName);
  }, buttonChangeTimeout)
}

function getCopyButtonOnClick(textAreaId) {
  return (evt) => {
    if (evt.target.classList.contains(busyClass)) return;

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
    if (evt.target.classList.contains(busyClass)) return;

    const textarea = document.getElementById(textAreaId);
    textarea.value = '';

    setTempButtonStyle(evt, 'Reset!', 'btn-secondary', 'btn-success');
  }
}

function downloadLists() {
  fetch('https://raw.githubusercontent.com/dolphinspired/osrs-ground-item-list/main/Filtered.txt')
    .then((res) => res.text())
    .then((text) => {
      const textarea = document.getElementById('filtered-items-code-block');
      textarea.value = text;
    });

  fetch('https://raw.githubusercontent.com/dolphinspired/osrs-ground-item-list/main/Highlighted.txt')
    .then((res) => res.text())
    .then((text) => {
      const textarea = document.getElementById('highlighted-items-code-block');
      textarea.value = text;
    });
}

function setupEvents() {
  const filteredItemsCopyButton = document.getElementById('filtered-items-copy-button');
  filteredItemsCopyButton.onclick = getCopyButtonOnClick('filtered-items-code-block');

  const filteredItemsResetButton = document.getElementById('filtered-items-reset-button');
  filteredItemsResetButton.onclick = getResetButtonOnClick('filtered-items-code-block');

  const highlightedItemsCopyButton = document.getElementById('highlighted-items-copy-button');
  highlightedItemsCopyButton.onclick = getCopyButtonOnClick('highlighted-items-code-block');

  const highlightedItemsResetButton = document.getElementById('highlighted-items-reset-button');
  highlightedItemsResetButton.onclick = getResetButtonOnClick('highlighted-items-code-block');
}

function init() {
  downloadLists();
  setupEvents();
}