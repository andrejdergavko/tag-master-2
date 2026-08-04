import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function PrintTagsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        type="link"
        onClick={() => navigate(-1)}
        style={{ paddingInline: 0, marginBottom: 16 }}
      >
        Назад
      </Button>
    </div>
  );
}
