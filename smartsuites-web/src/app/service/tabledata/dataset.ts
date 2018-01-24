/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

/**
 * The abstract dataset rapresentation
 */
class Dataset {
  /**
   * Load the paragraph result, every Dataset implementation must override this method
   * where is contained the business rules to convert the paragraphResult object to the related dataset type
   */
  loadParagraphResult(paragraphResult) {
    // override this
  }
}

/**
 * Dataset types
 */
const DatasetType = Object.freeze({
  NETWORK: 'NETWORK',
  TABLE: 'TABLE'
})

export {Dataset, DatasetType}
