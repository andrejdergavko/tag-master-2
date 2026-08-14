import { useState } from 'react';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Modal, Spin } from 'antd';
import {
  useFetchAllDocuments,
  SupplierFetchState,
} from '../../modules/documents/hooks/useFetchAllDocuments';

function StatusIcon({ state }: { state: SupplierFetchState }) {
  if (state.status === 'pending') {
    return <Spin size="small" />;
  }

  if (state.status === 'success') {
    return <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />;
  }

  if (state.status === 'error') {
    return (
      <CloseCircleFilled
        style={{ color: '#ff4d4f', fontSize: 18 }}
        title={state.errorMessage}
      />
    );
  }

  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#d9d9d9',
      }}
    />
  );
}

export default function UpdateAllButton() {
  const [open, setOpen] = useState(false);
  const { statuses, isRunning, start, reset, suppliers } =
    useFetchAllDocuments();

  const handleOpen = () => {
    reset();
    setOpen(true);
    start();
  };

  const handleClose = () => {
    if (isRunning) return;
    setOpen(false);
  };

  return (
    <>
      <Button type="default" loading={isRunning} onClick={handleOpen}>
        Обновить всех поставщиков
      </Button>

      <Modal
        title="Обновление поставщиков"
        open={open}
        onCancel={handleClose}
        closable={!isRunning}
        maskClosable={false}
        keyboard={!isRunning}
        footer={
          <Button type="primary" disabled={isRunning} onClick={handleClose}>
            Закрыть
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {supplier.icon ? (
                  <img
                    src={supplier.icon.src}
                    style={{
                      ...supplier.icon.style,
                    }}
                  />
                ) : null}
                <span>{supplier.name}</span>
              </div>
              <StatusIcon state={statuses[supplier.id]} />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
