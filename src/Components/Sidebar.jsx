import React from "react";
const Sidebar = () => (
  <aside className="bg-dark text-white w-64 min-h-screen py-8 px-4 shadow-lg">
    <nav>
      <a className="block py-2 mb-2 hover:bg-primary rounded" href="/admin/billing">Billing</a>
      <a className="block py-2 mb-2 hover:bg-primary rounded" href="/admin/clients">Clients</a>
      <a className="block py-2 mb-2 hover:bg-primary rounded" href="/admin/invoices">Invoices</a>
      <a className="block py-2 mb-2 hover:bg-primary rounded" href="/admin/settings">Settings</a>
    </nav>
  </aside>
);
export default Sidebar;
