/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TableData from './tabledata'
import NetworkData from './networkdata'
import {DatasetType} from './dataset'

/**
 * Create table data object from paragraph table type result
 */
export default class DatasetFactory {
  createDataset(datasetType) {
    switch (datasetType) {
      case DatasetType.NETWORK:
        return new NetworkData(null)
      case DatasetType.TABLE:
        return new TableData(null,null,null)
      default:
        throw new Error('Dataset type not found')
    }
  }
}
