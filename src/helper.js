export function transformOptions(option) {
  return option.map(item => {
    return {
      label: item.value,
      value: item.key
    };
  });
}

export function getValByPath(path, object) {
  if (!object) {
    return '';
  }

  const splitedPath = path.split('.');
  let result = '';
  let temp = object;

  for (let index = 0; index < splitedPath.length; index++) {
    const attr = splitedPath[index];
    if (temp[attr] !== undefined) {
      result = temp[attr];
      temp = temp[attr];
    } else {
      break;
    }
  }

  return result + '';
}

// 判断两个数据相等
export function isEqualModel(a, b) {
  if (a === b) { // 原始类型
    return true;
  }

  try { // 对象类型
    const _a = JSON.stringify(a);
    const _b = JSON.stringify(b);
    return _a === _b;
  } catch (e) {
    return false;
  }
}