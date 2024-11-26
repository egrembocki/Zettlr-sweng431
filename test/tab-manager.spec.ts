/* eslint-disable no-undef */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        tab-manager tester
 * CVM-Role:        TESTING
 * Maintainer:      Josh Ewart
 * License:         GNU GPL v3
 *
 * Description:     This file tests a component of Zettlr.
 *
 * END HEADER
 */

import { strictEqual, deepStrictEqual } from 'assert';
import { TabManager } from '../source/app/service-providers/documents/document-tree/tab-manager';
import type { OpenDocument } from '@dts/common/documents';

describe('TabManager', function () {
  let tabManager: TabManager;

  beforeEach(() => {
    tabManager = new TabManager();
  });

  it('should initialize with no open files and no active file', function () {
    strictEqual(tabManager.openFiles.length, 0, 'Expected no open files');
    strictEqual(tabManager.activeFile, null, 'Expected no active file');
  });

  it('should open a file and set it as active', function () {
    const filePath = '/path/to/file1';
    const result = tabManager.openFile(filePath);
    strictEqual(result, true, 'Expected result to be true');
    strictEqual(tabManager.openFiles.length, 1, 'Expected one open file');
    strictEqual(tabManager.activeFile?.path, filePath, 'Expected active file path to match');
  });

  it('should not open a file that is already active', function () {
    const filePath = '/path/to/file1';
    tabManager.openFile(filePath);
    const result = tabManager.openFile(filePath);
    strictEqual(result, false, 'Expected result to be false');
    strictEqual(tabManager.openFiles.length, 1, 'Expected one open file');
  });

  it('should close an open file', function () {
    const filePath = '/path/to/file1';
    tabManager.openFile(filePath);
    const result = tabManager.closeFile(filePath);
    strictEqual(result, true, 'Expected result to be true');
    strictEqual(tabManager.openFiles.length, 0, 'Expected no open files');
    strictEqual(tabManager.activeFile, null, 'Expected no active file');
  });

  it('should not close a file that is not open', function () {
    const filePath = '/path/to/file1';
    const result = tabManager.closeFile(filePath);
    strictEqual(result, false, 'Expected result to be false');
  });

  it('should replace the file path of an open file', function () {
    const oldPath = '/path/to/file1';
    const newPath = '/new/path/to/file1';
    tabManager.openFile(oldPath);
    const result = tabManager.replaceFilePath(oldPath, newPath);
    strictEqual(result, true, 'Expected result to be true');
    strictEqual(tabManager.openFiles[0].path, newPath, 'Expected new file path to match');
  });

  it('should not replace the file path if the file is not open', function () {
    const oldPath = '/path/to/file1';
    const newPath = '/new/path/to/file1';
    const result = tabManager.replaceFilePath(oldPath, newPath);
    strictEqual(result, false, 'Expected result to be false');
  });

  it('should sort open files based on the given path array', function () {
    const file1 = '/path/to/file1';
    const file2 = '/path/to/file2';
    const file3 = '/path/to/file3';
    tabManager.openFile(file1);
    tabManager.openFile(file2);
    tabManager.openFile(file3);
    const result = tabManager.sortOpenFiles([file3, file1, file2]);
    strictEqual(result, true, 'Expected result to be true');
    deepStrictEqual(tabManager.openFiles.map(file => file.path), [file3, file1, file2], 'Expected sorted file paths to match');
  });

  it('should set the pinned status of a file', function () {
    const filePath = '/path/to/file1';
    tabManager.openFile(filePath);
    tabManager.setPinnedStatus(filePath, true);
    strictEqual(tabManager.openFiles[0].pinned, true, 'Expected pinned status to be true');
  });

  it('should move through session history', function () {
    const file1 = '/path/to/file1';
    const file2 = '/path/to/file2';
    tabManager.openFile(file1);
    tabManager.openFile(file2);
    tabManager.back();
    strictEqual(tabManager.activeFile?.path, file1, 'Expected active file path to match file1');
    tabManager.forward();
    strictEqual(tabManager.activeFile?.path, file2, 'Expected active file path to match file2');
  });

  it('should return a JSON representation of the tab manager', function () {
    const filePath = '/path/to/file1';
    tabManager.openFile(filePath);
    const json = tabManager.toJSON();
    strictEqual(json.openFiles.length, 1, 'Expected one open file in JSON');
    strictEqual(json.activeFile?.path, filePath, 'Expected active file path in JSON to match');
  });
});