import { MutHandler } from '@handlers/types';
import Logger from '@src/lib/logging';
import { getWordCount, doubleSpace } from '@lib/textProcessing';
import Turndown from '@lib/turndown';
import markdownToTxt from 'markdown-to-txt';

import { elementHasMtcHelperAttribute, addMtcHelperAttributeToElement } from '..';

import { getWordCountElement, getCopyButton, getControlsContainer } from './utils';

export const handlePandaPromptMutation: MutHandler = (mutation: Element) => {
    const closeButton = Array.from(mutation.querySelectorAll('button')).find(
        button => button.textContent === 'Close'
    );

    if (!closeButton || elementHasMtcHelperAttribute(closeButton)) {
        return;
    }

    Logger.debug('Handling panda prompt mutation.');
    addMtcHelperAttributeToElement(closeButton);

    const promptElement = closeButton.parentElement?.parentElement?.children[1];
    if (!promptElement || !(promptElement instanceof HTMLElement)) {
        Logger.debug('Prompt element not found.');

        return;
    }

    const promptContent = promptElement.textContent || '';
    const wordCount = getWordCount(promptContent);

    const container = getControlsContainer();
    const wcElement = getWordCountElement(wordCount);
    const markdownCopyButton = getCopyButton('Copy Markdown');
    const plaintextCopyButton = getCopyButton('Copy Plaintext');

    markdownCopyButton.addEventListener('click', () => {
        const markdown = Turndown.getInstance()?.turndown(promptElement);
        if (markdown) {
            navigator.clipboard.writeText(markdown);
        }
    });

    plaintextCopyButton.addEventListener('click', () => {
        const plaintext = markdownToTxt(promptContent);

        const processedPlaintext = doubleSpace(plaintext);

        navigator.clipboard.writeText(processedPlaintext);
    });

    container.appendChild(wcElement);
    container.appendChild(plaintextCopyButton);
    container.appendChild(markdownCopyButton);

    closeButton.parentElement?.insertAdjacentElement('afterend', container);
};
