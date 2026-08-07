import { Breadcrumb, Layout, theme } from 'antd';
import { Outlet, useParams } from 'react-router-dom';

import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar/AppSidebar';
import suppliers from '../../../modules/suppliers';
import { pageNames, Pages } from '../../constants/routes';
import { DOCUMENT_TYPE_CONFIG } from '../../constants/documentType';
import { useGetDocument } from '../../../modules/documents/hooks/useGetDocument';
import { SupplierId } from '../../types';
import { formatDate } from '../../utils/date';

const { Content } = Layout;

export default function AppLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { supplierId, documentId } = useParams();
  const supplier = suppliers.find((item) => item.id === supplierId);

  const { data: document } = useGetDocument(
    supplierId as SupplierId | undefined,
    documentId,
  );

  const documentTitle =
    document &&
    [
      document.date ? formatDate(document.date) : null,
      DOCUMENT_TYPE_CONFIG[document.type].label,
    ]
      .filter(Boolean)
      .join(' ');

  const breadcrumbItems = [
    { title: pageNames[Pages.documents] },
    ...(supplier ? [{ title: supplier.name }] : []),
    ...(documentTitle ? [{ title: documentTitle }] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSidebar />
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
