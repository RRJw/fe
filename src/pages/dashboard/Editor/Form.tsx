import React, { useState } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import PromQLInput from '@/components/PromQLInput';
import { defaultValues, defaultCustomValuesMap } from './config';
import Options from './Options';
import Collapse, { Panel } from './Components/Collapse';
import VariableConfig, { VariableType } from '../VariableConfig';

const alphabet = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('');

export default function FormCpt(props) {
  const { chartForm, setChangedFlag, initialValues, type, variableConfig, cluster, render } = props;
  const [innerVariableConfig, setInnerVariableConfig] = useState<VariableType | undefined>(variableConfig);

  defaultValues.custom = defaultCustomValuesMap[_.get(initialValues, 'type') || defaultValues.type];

  return (
    <Form
      layout='vertical'
      form={chartForm}
      initialValues={_.merge({}, defaultValues, initialValues)}
      onValuesChange={(aa) => {
        setChangedFlag(_.uniqueId('xxx_'));
      }}
    >
      <div
        style={{
          height: 'calc(100vh - 173px)',
        }}
      >
        <Row
          gutter={20}
          style={{
            flexWrap: 'nowrap',
            height: '100%',
          }}
        >
          <Col flex={1} style={{ minWidth: 100 }}>
            <div style={{ marginBottom: 20 }}>{render(innerVariableConfig)}</div>
            <div style={{ height: 'calc(100% - 320px)', overflowY: 'auto' }}>
              <VariableConfig
                onChange={(value) => {
                  setInnerVariableConfig(value);
                }}
                value={innerVariableConfig}
                editable={false}
                cluster={cluster}
              />
              <Form.List name='targets'>
                {(fields, { add, remove }, { errors }) => {
                  return (
                    <>
                      <Collapse>
                        {fields.length ? (
                          fields.map(({ name }, index) => {
                            return (
                              <Panel header={`Query ${alphabet[index]}`} key={index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Form.Item
                                    label='PromQL'
                                    name={[name, 'expr']}
                                    validateTrigger={['onBlur']}
                                    rules={[
                                      {
                                        required: true,
                                        message: '请输入PromQL',
                                      },
                                    ]}
                                    style={{ flex: 1 }}
                                  >
                                    <PromQLInput
                                      url='/api/n9e/prometheus'
                                      headers={{
                                        'X-Cluster': 'Default',
                                        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
                                      }}
                                    />
                                  </Form.Item>
                                  {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      style={{ marginLeft: 10 }}
                                      onClick={() => {
                                        remove(name);
                                      }}
                                    />
                                  ) : null}
                                  {index === fields.length - 1 && (
                                    <PlusCircleOutlined
                                      style={{ marginLeft: 10 }}
                                      onClick={() => {
                                        add({ expr: '' });
                                      }}
                                    />
                                  )}
                                </div>
                                <Form.Item
                                  label='Legend'
                                  name={[name, 'legend']}
                                  tooltip={{
                                    getPopupContainer: () => document.body,
                                    title:
                                      'Controls the name of the time series, using name or pattern. For example {{hostname}} will be replaced with label value for the label hostname.',
                                  }}
                                >
                                  <Input />
                                </Form.Item>
                              </Panel>
                            );
                          })
                        ) : (
                          <PlusCircleOutlined
                            onClick={() => {
                              add({
                                PromQL: '',
                              });
                            }}
                          />
                        )}
                        <Form.ErrorList errors={errors} />
                      </Collapse>
                    </>
                  );
                }}
              </Form.List>
            </div>
          </Col>
          <Col flex='600px' style={{ overflowY: 'auto' }}>
            <Collapse>
              <Panel header='面板配置'>
                <>
                  <Form.Item
                    label={'标题'}
                    name='name'
                    rules={[
                      {
                        required: true,
                        message: '图表名称',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label={'下钻链接'} name='link'>
                    <Input />
                  </Form.Item>
                  <Form.Item label='备注' name='description'>
                    <Input.TextArea placeholder='支持 markdown' />
                  </Form.Item>
                </>
              </Panel>
              <Options type={type} />
            </Collapse>
          </Col>
        </Row>
      </div>
    </Form>
  );
}
