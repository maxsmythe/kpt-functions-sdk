/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { spawnSync } from 'child_process';
import { processDockerfile } from './docker_create';
import { log } from '../utils/log';

export function dockerBuild(packageDir: string, dockerTag: string) {
  log('Building image...\n');
  processDockerfile(
    packageDir,
    dockerTag,
    (dockerFile, functionName, image) => {
      const build = spawnSync(
        'docker',
        ['build', '-q', '-t', image, '-f', dockerFile, '.'],
        {
          stdio: 'inherit',
        }
      );
      if (build.status !== 0) {
        let msg = 'Failed to build docker image';
        if (build.error) {
          msg = `${msg}: ${build.error}`;
        }
        throw new Error(msg);
      }
    }
  );
}
