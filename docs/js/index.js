(function() {
  const config = {
    buttonChangeTimeout: 2000,

    filteredListUrl: 'https://raw.githubusercontent.com/dolphinspired/osrs-ground-item-list/main/Filtered.txt',
    highlightedListUrl: 'https://raw.githubusercontent.com/dolphinspired/osrs-ground-item-list/main/Highlighted.txt',

    filteredCardId: 'filtered-card',
    highlightedCardId: 'highlighted-card',

    selectors: {
      copyButton: '.copy-button',
      resetButton: '.reset-button',
      saveButton: '.save-button',
      saveWarning: '.save-warning',
      textArea: '.item-list-textarea',
    },
  };

  const downloadCache = {};

  function getCardElement(cardId, selector) {
    return document.getElementById(cardId).querySelector(selector);
  }

  function setEnabled(elem, flag) {
    if (flag) {
      elem.removeAttribute('disabled');
    } else {
      elem.setAttribute('disabled', 'disabled');
    }
  }

  function setVisible(elem, flag) {
    if (flag) {
      elem.style.visibility = 'visible';
    } else {
      elem.style.visibility = 'hidden';
    }
  }

  function setTempButtonStyle(button, message, fromClassName, toClassName, enabledAfterFlag) {
    const origMessage = button.innerText;

    button.innerText = message;
    button.classList.remove(fromClassName);
    button.classList.add(toClassName);
    setEnabled(button, false);

    setTimeout(() => {
      button.innerText = origMessage;
      button.classList.remove(toClassName);
      button.classList.add(fromClassName);
      setEnabled(button, enabledAfterFlag);
    }, config.buttonChangeTimeout)
  }

  function getCopyButtonOnClick(cardId) {
    return (evt) => {
      const textArea = getCardElement(cardId, config.selectors.textArea);
      const contents = textArea.value
        .replaceAll('\r', '')
        .replaceAll('\n', '')
        .replaceAll('  ', '');

      navigator.clipboard.writeText(contents).then(
        () => setTempButtonStyle(evt.target, 'Copied!', 'btn-primary', 'btn-success', true),
        () => setTempButtonStyle(evt.target, 'Copy failed!', 'btn-primary', 'btn-danger', true)
      );
    }
  }

  function getResetButtonOnClick(cardId) {
    return (evt) => {
      const textArea = getCardElement(cardId, config.selectors.textArea);
      const saveButton = getCardElement(cardId, config.selectors.saveButton);
      const saveWarning = getCardElement(cardId, config.selectors.saveWarning);

      textArea.value = downloadCache[cardId];

      setEnabled(saveButton, true);
      setVisible(saveWarning, true);
      setTempButtonStyle(evt.target, 'Reset!', 'btn-secondary', 'btn-success', false);
    }
  }

  function getSaveButtonOnClick(cardId) {
    return (evt) => {
      const textArea = getCardElement(cardId, config.selectors.textArea);
      const resetButton = getCardElement(cardId, config.selectors.resetButton);
      const saveWarning = getCardElement(cardId, config.selectors.saveWarning);

      const matchesDownloadFile = textArea.value === downloadCache[cardId];

      try {
        if (matchesDownloadFile) {
          localStorage.removeItem(cardId);
        } else {
          localStorage.setItem(cardId, textArea.value);
        }
      } catch (err) {
        console.error(err);
        setTempButtonStyle(evt.target, 'Save failed!', 'btn-primary', 'btn-danger', true);
        return;
      }

      setVisible(saveWarning, false);
      setEnabled(resetButton, !matchesDownloadFile);
      setTempButtonStyle(evt.target, 'Saved!', 'btn-primary', 'btn-success', false);
    }
  }

  function getTextAreaOnInput(cardId) {
    return (evt) => {
      const saveButton = getCardElement(cardId, config.selectors.saveButton);
      const saveWarning = getCardElement(cardId, config.selectors.saveWarning);

      setEnabled(saveButton, true);
      setVisible(saveWarning, true);
    }
  }

  function downloadLists() {
    const initializeList = (cardId, downloadedList) => {
      downloadCache[cardId] = downloadedList;

      const textArea = getCardElement(cardId, config.selectors.textArea);
      const resetButton = getCardElement(cardId, config.selectors.resetButton);
      const savedList = localStorage.getItem(cardId);

      if (savedList) {
        console.log(`Loaded '${cardId}' from localStorage`);
        textArea.value = savedList;
        setEnabled(resetButton, true);
      } else {
        console.log(`Loaded '${cardId}' from downloaded file`);
        textArea.value = downloadedList;
        setEnabled(resetButton, false);
      }
    }

    fetch(config.filteredListUrl)
      .then((res) => res.text())
      .then((dl) => initializeList(config.filteredCardId, dl));

    fetch(config.highlightedListUrl)
      .then((res) => res.text())
      .then((dl) => initializeList(config.highlightedCardId, dl));
  }

  function setupEvents() {
    const setup = (cardId) => {
      const copyButton = getCardElement(cardId, config.selectors.copyButton);
      copyButton.onclick = getCopyButtonOnClick(cardId);

      const resetButton = getCardElement(cardId, config.selectors.resetButton);
      resetButton.onclick = getResetButtonOnClick(cardId);
      setEnabled(resetButton, false);

      const saveButton = getCardElement(cardId, config.selectors.saveButton);
      saveButton.onclick = getSaveButtonOnClick(cardId);
      setEnabled(saveButton, false);

      const textArea = getCardElement(cardId, config.selectors.textArea);
      textArea.oninput = getTextAreaOnInput(cardId);

      const saveWarning = getCardElement(cardId, config.selectors.saveWarning);
      setVisible(saveWarning, false);
    };

    setup(config.filteredCardId);
    setup(config.highlightedCardId);
  }

  function init() {
    setupEvents();
    downloadLists();
  }

  init();
})();
