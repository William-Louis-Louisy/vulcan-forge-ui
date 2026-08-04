import * as nodeCrypto from 'node:crypto';
import { PasswordHashingUnavailableError } from './password.errors';
import type { Argon2idParameters } from './password-hash-format';

type NodeArgon2Parameters = {
  memory: number;
  message: Buffer;
  nonce: Buffer;
  parallelism: number;
  passes: number;
  tagLength: number;
};

type NodeArgon2Callback = (
  error: Error | null,
  derivedKey?: Buffer,
) => void;

type NodeArgon2Function = (
  algorithm: 'argon2id',
  parameters: NodeArgon2Parameters,
  callback: NodeArgon2Callback,
) => void;

function getNodeArgon2() {
  const argon2 = (
    nodeCrypto as typeof nodeCrypto & {
      argon2?: NodeArgon2Function;
    }
  ).argon2;

  if (typeof argon2 !== 'function') {
    throw new PasswordHashingUnavailableError();
  }

  return argon2;
}

export function isArgon2idAvailable() {
  return (
    typeof (
      nodeCrypto as typeof nodeCrypto & {
        argon2?: NodeArgon2Function;
      }
    ).argon2 === 'function'
  );
}

export async function deriveArgon2id({
  parameters,
  password,
  salt,
}: {
  parameters: Argon2idParameters;
  password: string;
  salt: Buffer;
}) {
  const argon2 = getNodeArgon2();

  return await new Promise<Buffer>((resolve, reject) => {
    try {
      argon2(
        'argon2id',
        {
          memory: parameters.memory,
          message: Buffer.from(password, 'utf8'),
          nonce: salt,
          parallelism: parameters.parallelism,
          passes: parameters.passes,
          tagLength: parameters.tagLength,
        },
        (error, derivedKey) => {
          if (error) {
            reject(error);
            return;
          }

          if (!derivedKey) {
            reject(new Error('Argon2id returned no derived key.'));
            return;
          }

          resolve(derivedKey);
        },
      );
    } catch (error) {
      reject(error);
    }
  });
}
