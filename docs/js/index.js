const buttonChangeTimeout = 2000;

function setTempButtonStyle(evt, message, className) {
  const button = evt.target;
  const origMessage = button.innerText;

  button.innerText = message;
  button.classList.remove('btn-primary');
  button.classList.add(className);

  setTimeout(() => {
    button.innerText = origMessage;
    button.classList.remove(className);
    button.classList.add('btn-primary');
  }, buttonChangeTimeout)
}

function getCopyButtonOnClick(textAreaId) {
  return (evt) => {
    const textarea = document.getElementById(textAreaId);
    const contents = textarea.value
      .replaceAll('\r', '')
      .replaceAll('\n', '')
      .replaceAll('  ', '');

    navigator.clipboard.writeText(contents).then(
      () => setTempButtonStyle(evt, 'Copied!', 'btn-success'),
      () => setTempButtonStyle(evt, 'Copy failed!', 'btn-danger')
    );
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

  const highlightedItemsCopyButton = document.getElementById('highlighted-items-copy-button');
  highlightedItemsCopyButton.onclick = getCopyButtonOnClick('highlighted-items-code-block');
}

function init() {
  downloadLists();
  setupEvents();
}