export const schema = {
  groups: [
    {
      title: '表单标题',
      descript: '这是放置表单的描述信息',
      name: 'group1'
    },
    {
      title: '显示隐藏联动',
      descript: '这是放置表单的描述信息',
      name: 'show-hide'
    }
  ],
  fields: [
    {
      group: 'group1',
      type: 'input',
      name: 'field0',
      label: '文本框1',
      props: {
        placeholder: '请输入'
      }
    },
    {
      group: 'group1',
      type: 'text',
      name: 'field_test',
      label: '纯文本',
      props: {
        placeholder: '请输入'
      }
    },
    {
      group: 'group1',
      type: 'input',
      name: 'field1',
      label: '文本框2',
      props: {
        placeholder: '和文本1联动'
      },
      rules: {
        required: true,
        type: 'string',
        minlen: 5
      },
      depends: [
        {
          target: 'field0'
        }
      ]
    },
    {
      group: 'group1',
      type: 'checkbox-group',
      name: 'field2',
      label: '复选框组',
      layout: 'vertical',
      props: {
        horizontal: true,
        options: [
          {
            label: '选项1',
            value: '1'
          },
          {
            label: '选项2',
            value: '2'
          }
        ]
      }
    },
    {
      group: 'group1',
      type: 'radio-group',
      name: 'field3',
      label: '单选框',
      layout: 'vertical',
      props: {
        position: 'right',
        options: [
          {
            label: '选项1',
            value: '0'
          },
          {
            label: '选项2',
            value: '1'
          },
          {
            label: '选项3',
            value: '2'
          }
        ]
      }
    },
    {
      group: 'group1',
      type: 'checker',
      name: 'field4',
      layout: 'vertical',
      label: 'Checker',
      props: {
        options: [
          {
            text: '选项1',
            value: '0'
          },
          {
            text: '选项2',
            value: '1'
          }
        ]
      }
    },
    {
      group: 'group1',
      type: 'textarea',
      name: 'field6',
      label: 'textarea',
      layout: 'vertical',
      rules: {
        required: true
      }
    },
    {
      group: 'group1',
      type: 'select',
      name: 'field7',
      label: 'select',
      props: {
        options: [
          {
            label: '选项1',
            value: '0'
          },
          {
            label: '选项2',
            value: '1'
          }
        ]
      }
    },
    {
      group: 'group1',
      type: 'switch',
      name: 'field8',
      label: 'switch'
    },
    {
      group: 'group1',
      type: 'rate',
      name: 'field9',
      layout: 'vertical',
      label: 'rate'
    },
    {
      group: 'show-hide',
      type: 'input',
      name: 'show-hide-1',
      label: '文本1',
      props: {
        placeholder: '输入2，隐藏，其他显示'
      }
    },
    {
      group: 'show-hide',
      type: 'checkbox-group',
      name: 'show-hide-2',
      label: '文本2',
      props: {
        placeholder: '依赖文本1',
        options: [
          {
            'label': '选项1',
            'value': 1
          },
          {
            'label': '选项2',
            'value': 2
          },
          {
            'label': '选项3',
            'value': 3
          },
          {
            'label': '选项4',
            'value': 4
          }
        ]
      },
      depends: [
        {
          'target': 'show-hide-1',
          'handle': 'hide'
        },
        {
          'target': 'show-hide-1',
          'data': '2',
          'handle': 'show'
        },
      ],
      rules: {
        required: true
      }
    }
  ],
  submit: {
    validateAll: true,
    label: '提 交'
  }
};