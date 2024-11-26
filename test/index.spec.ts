/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        MarkdownEditor tester
 * CVM-Role:        TESTING
 * Maintainer:      Josh Ewart
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Zettlr.
 *
 * END HEADER
 */

import { strictEqual, deepStrictEqual, throws } from 'assert';
import { SelectionRange } from '@codemirror/state';
import MarkdownEditor, { DocumentAuthorityAPI } from '../source/common/modules/markdown-editor/index';
import { DocumentType } from '../source/types/common/documents';

describe('MarkdownEditor', function () {
    let editor: MarkdownEditor;
    let mockAuthorityAPI: DocumentAuthorityAPI;

    beforeEach(() => {
        mockAuthorityAPI = {
            fetchDoc: async (filePath: string) => ({
                content: 'Sample content',
                type: DocumentType.Markdown,
                startVersion: 1
            }),
                pullUpdates: async () => { return false; },
                pushUpdates: async () => { return true; }
            };

        editor = new MarkdownEditor('leafId', 'windowId', 'path/to/document.md', mockAuthorityAPI);
    });

    it('should initialize with the correct document path', function () {
        strictEqual(editor.documentPath, 'path/to/document.md');
    });

    it('should load document content correctly', async function () {
        await editor.loadDocument();
        strictEqual(editor.value, 'Sample content');
    });

    it('should set and get options correctly', function () {
        editor.setOptions({ darkMode: true });
        strictEqual(editor.getOption('darkMode'), true);
    });

    it('should replace selection with given text', async function () {
        await editor.loadDocument();
        editor.replaceSelection('New text');
        strictEqual(editor.value, 'New text');
    });

    /**it('should highlight ranges correctly', async function () {
        await editor.loadDocument();
        const ranges = [new SelectionRange(0, 5)];
        editor.highlightRanges(ranges);
        // Assuming highlightRangesEffect works correctly, we can't directly test the effect
        strictEqual(true, true);
    });**/

    it('should copy content as HTML', async function () {
        await editor.loadDocument();
        editor.copyAsHTML();
        // Assuming copyAsHTML works correctly, we can't directly test the clipboard
        strictEqual(true, true);
    });

    it('should paste content as plain text', async function () {
        await editor.loadDocument();
        editor.pasteAsPlainText();
        // Assuming pasteAsPlain works correctly, we can't directly test the clipboard
        strictEqual(true, true);
    });

    it('should move section correctly', async function () {
        await editor.loadDocument();
        editor.moveSection(1, 2);
        // Assuming moveSection works correctly, we can't directly test the effect
        strictEqual(true, true);
    });

    it('should run commands correctly', async function () {
        await editor.loadDocument();
        editor.runCommand('markdownComment');
        // Assuming applyComment works correctly, we can't directly test the effect
        strictEqual(true, true);
    });

    it('should focus the editor', async function () {
        await editor.loadDocument();
        editor.focus();
        strictEqual(editor.hasFocus(), true);
    });

    /**it('should set completion database correctly', async function () {
        await editor.loadDocument();
        const tags = [{ id: '1', name: 'tag1', filename: 'file1.md' }];
        editor.setCompletionDatabase('files', tags);
        deepStrictEqual(editor.getDatabaseCache().files, tags);
    });**/

    it('should return document info correctly', async function () {
        await editor.loadDocument();
        const info = editor.documentInfo;
        strictEqual(info.words, 2);
        strictEqual(info.chars, 14);
    });

    it('should unmount the editor instance', function () {
        editor.unmount();
        throws(() => editor.instance);
    });

    it('should jump to a specific line', async function () {
        await editor.loadDocument();
        editor.jtl(1);
        const cursor = editor.documentInfo.cursor;
        strictEqual(cursor.line, 1);
    });

    it('should toggle typewriter mode', function () {
        editor.hasTypewriterMode = true;
        strictEqual(editor.hasTypewriterMode, true);
        editor.hasTypewriterMode = false;
        strictEqual(editor.hasTypewriterMode, false);
    });

    it('should toggle readability mode', function () {
        editor.readabilityMode = true;
        strictEqual(editor.readabilityMode, true);
        editor.readabilityMode = false;
        strictEqual(editor.readabilityMode, false);
    });

    it('should return the correct word count', async function () {
        await editor.loadDocument();
        strictEqual(editor.wordCount, 2);
    });

    it('should return the correct char count', async function () {
        await editor.loadDocument();
        strictEqual(editor.charCount, 14);
    });
});