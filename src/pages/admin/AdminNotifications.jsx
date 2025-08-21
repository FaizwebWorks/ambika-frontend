import AdminNotifications from '../../components/admin/AdminNotifications';

const AdminNotificationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
        <p className="text-neutral-600">Manage and view all system notifications</p>
      </div>
      
      <AdminNotifications />
    </div>
  );
};

export default AdminNotificationsPage;
