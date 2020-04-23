/* eslint-disable indent */
/**
 * 根据组件类型，生成文本值
 *
 * @export
 * @param {*} type text: 文本，select: 选择
 * @returns
 */
export default function ({
  valueToString: {
    type = 'text'
  } = {}
} = {}) {
  return {
    methods: {
      valueToString() {
        const props = Object.assign({}, this.$props, this.$attrs);
        const options = props.options || [];
        const value = props.value;

        switch (type) {
          case 'text':
            return value; // 文本类
          case 'select': {
            const type = typeof value;
            const valArr = type === 'array' ? value : [value];
            const chosen = [];
            valArr.forEach((val) => {
              const chosenItem = options.find(option => option.value === val);
              if (chosenItem) {
                chosen.push(chosenItem.label);
              }
            });
            return chosen ? chosen.join(',') : '';
          }
          default:
            return String(value);
        }
      }
    }
  };
}