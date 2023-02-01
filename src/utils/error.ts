import _cypherIdl from '../generated/idl/cypher.json';

export const getCustomProgramErrorCode = (
  errMessage: string
): [boolean, string] => {
  const idx = errMessage.indexOf('custom program error:');
  if (idx == -1) {
    return [false, 'May not be a custom program error'];
  } else {
    return [
      true,
      `${parseInt(
        errMessage.substring(idx + 22, idx + 28).replace(' ', ''),
        16
      )}`
    ];
  }
};

export const getErrName = (errCode: number): string => {
  const code = Number(errCode);
  const customProgramErrors = _cypherIdl.errors;
  if (code >= 100 && code <= 5000) {
    return `This is an Anchor program error code ${code}. Please check here: https://github.com/project-serum/anchor/blob/master/lang/src/error.rs`;
  }

  for (let i = 0; i < customProgramErrors.length; i++) {
    const err = customProgramErrors[i];
    if (err.code === code) {
      return err.name;
    }
  }
  return `No matching error code description or translation for ${errCode}`;
};

export const getErrNameAndMsg = (errCode: number): string => {
  const code = Number(errCode);
  const customProgramErrors = _cypherIdl.errors;
  if (code >= 100 && code <= 5000) {
    return `This is an Anchor program error code ${code}. Please check here: https://github.com/project-serum/anchor/blob/master/lang/src/error.rs`;
  }

  for (let i = 0; i < customProgramErrors.length; i++) {
    const err = customProgramErrors[i];
    if (err.code === code) {
      return `\n\nCustom Program Error Code: ${errCode} \n- ${err.name} \n- ${err.msg}`;
    }
  }
  return `No matching error code description or translation for ${errCode}`;
};

// eslint-disable-next-line
export const transactionErrorToString = (error: any) => {
  if (error.code) {
    return `Code ${error.code}: ${error.msg}\n${error.logs}\n${error.stack}`;
  } else {
    return `${error} ${getErrNameAndMsg(
      Number(getCustomProgramErrorCode(JSON.stringify(error))[1])
    )}`;
  }
};

// eslint-disable-next-line
export const transactionErrorToErrorName = (error: any) => {
  if (error.code) {
    return getErrName(error.code);
  } else {
    return getErrName(
      Number(getCustomProgramErrorCode(JSON.stringify(error))[1])
    );
  }
};
