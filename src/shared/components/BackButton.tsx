import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="text"
      size="large"
      icon={
        <ArrowLeftOutlined
          style={{ fontSize: 18, color: '#4b5563', marginRight: 8 }}
        />
      }
      onClick={() => navigate(-1)}
      style={{
        marginBottom: 16,
        paddingInline: 16,
        fontSize: 16,
        fontWeight: 400,
        borderRadius: 100,
      }}
    >
      Назад
    </Button>
  );
}
