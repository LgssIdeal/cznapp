import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import AccountView from './views/account/AccountView';
import CustomerListView from './views/customer/CustomerListView';
import UserListView from './views/user/UserListView';
import EmpresaListView from './views/empresa/EmpresaListView';
import ClienteListView from './views/cliente/ClienteListView';
import UnidadeListView from './views/unidade/UnidadeListView';
import UnidadeFormView from './views/unidade/UnidadeFormView';
import ClinicaListView from './views/clinica/ClinicaListView';
import ClinicaFormView from './views/clinica/ClinicaFormView';
import UserFormView from './views/user/UserFormView';
import EmpresaFormView from './views/empresa/EmpresaFormView';
import ClienteFormView from './views/cliente/ClienteFormView';
import TipoDietaListView from './views/tipodieta/TipoDietaListView';
import TipoDietaFormView from './views/tipodieta/TipoDietaFormView';
import DashboardView from './views/reports/DashboardView';
import LoginView from './views/auth/LoginView';
import NotFoundView from './views/errors/NotFoundView';
import NotAuthorizedView from './views/errors/NotAuthorizedView';
import ProductListView from './views/product/ProductListView';
import RegisterView from './views/auth/RegisterView';
import SettingsView from './views/settings/SettingsView';
import TipoDietaComplementarListView from './views/tipodietacomplementar/TipoDietaComplementarListView';
import TipoDietaComplementarFormView from './views/tipodietacomplementar/TipoDietaComplementarFormView';
import SobreListView from './views/sobre/SobreListView';
import ContratoListView from './views/contrato/ContratoListView';
import ContratoFormView from './views/contrato/ContratoFormView';
import ConfigContratoFormView from './views/contrato/ConfigContratoFormView';
import SelecaoClinicaView from './views/mapa/SelecaoClinicaView';
import MapaListView from './views/mapa/MapaListView';
import MapaFormView from './views/mapa/MapaFormView';
import SolicitacaoEntFormView from './views/solicitacao/SolicitacaoEntFormView';
import SolicitacaoListView from './views/solicitacao/SolicitacaoListView';
import SolicitacaoFormView from './views/solicitacao/SolicitacaoFormView';
import SolicitacaoItemListView from './views/solicitacao/SolicitacaoItemListView';
import SolicitacaoItemResumoListView from './views/solicitacao/SolicitacaoItemResumoListView';
import SolicitacaoItemFormView from './views/solicitacao/SolicitacaoItemFormView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'products', element: <ProductListView /> },
      { path: 'configuracoes', element: <SettingsView /> },
      { path: 'usuarios', element: <UserListView /> },
      { path: 'empresas', element: <EmpresaListView /> },
      { path: 'contratos', element: <ContratoListView /> },
      { path: 'contratos/:contratoId', element: <ContratoFormView /> },
      { path: 'contratos/:contratoId/configuracao', element: <ConfigContratoFormView /> },
      { path: 'unidades/cliente/:clienteId', element: <UnidadeListView /> },
      { path: 'unidades/cliente/:clienteId/:unidadeId', element: <UnidadeFormView /> },
      { path: 'clinicas/:clienteId/:unidadeId', element: <ClinicaListView /> },
      { path: 'clinicas/:clienteId/:unidadeId/:clinicaId', element: <ClinicaFormView /> },
      { path: 'clientes', element: <ClienteListView /> },
      { path: 'usuario/:userId', element: <UserFormView /> },
      { path: 'empresa/:empresaId', element: <EmpresaFormView /> },
      { path: 'cliente/:clienteId', element: <ClienteFormView /> },
      { path: 'tiposdieta', element: <TipoDietaListView /> },
      { path: 'tiposdieta/:tipoDietaId', element: <TipoDietaFormView /> },
      { path: 'tiposdietacomplementar/tipodieta/:tipoDietaId', element: <TipoDietaComplementarListView /> },
      { path: 'tiposdietacomplementar/tipodieta/:tipoDietaId/:tipoDietaCompId', element: <TipoDietaComplementarFormView /> },
      { path: 'sobre', element: <SobreListView /> },
      { path: 'mapas', element: <SelecaoClinicaView /> },
      { path: 'mapas/:clinicaId', element: <MapaListView /> },
      { path: 'mapas/:clinicaId/:mapaId', element: <MapaFormView /> },
      { path: 'solicitacoes', element: <SolicitacaoEntFormView /> },
      { path: 'solicitacoes/:contratoId/:unidadeId/:clinicaId/:dataReferencia', element: <SolicitacaoListView /> },
      { path: 'solicitacoes/:contratoId/:unidadeId/:clinicaId/:dataReferencia/:solicitacaoId', element: <SolicitacaoItemListView /> },
      { path: 'solicitacoes/:contratoId/:unidadeId/:clinicaId/:refeicao/:dataReferencia/:solicitacaoId/resumo', element: <SolicitacaoItemResumoListView /> },
      { path: 'solicitacoes/:contratoId/:unidadeId/:clinicaId/:dataReferencia/form', element: <SolicitacaoFormView /> },
      { path: 'solicitacoes/:contratoId/:unidadeId/:clinicaId/:dataReferencia/:solicitacaoId/:solicitacaoItemId', element: <SolicitacaoItemFormView /> },
      { path: '401', element: <NotAuthorizedView /> },
      { path: '*', element: <Navigate to="/404" /> }

    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '401', element: <NotAuthorizedView />},
      { path: '/', element: <Navigate to="login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
