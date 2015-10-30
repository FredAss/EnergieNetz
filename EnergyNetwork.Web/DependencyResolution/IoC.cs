// --------------------------------------------------------------------------------------------------------------------
// <copyright file="IoC.cs" company="Web Advanced">
// Copyright 2012 Web Advanced (www.webadvanced.com)
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------


using EnergyNetwork.Data;
using EnergyNetwork.Data.UnitOfWork;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Web.Helpers;
using EnergyNetwork.Web.SEO;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using StructureMap;
using StructureMap.Graph;

namespace EnergyNetwork.Web.DependencyResolution
{
  public static class IoC
  {
    public static IContainer Initialize()
    {
      ObjectFactory.Initialize(x =>
                               {
                                 x.Scan(scan =>
                                        {
                                          scan.TheCallingAssembly();
                                          scan.WithDefaultConventions();
                                        });
                                 x.For<IUnitOfWork>().
                                   Use(() => new UnitOfWork(new BreezeValidator(new ApplicationUserManager(new UserStore<UserProfile>(new EnergyNetworkDbContext())))));

                                 x.For<ISnapshot>().
                                   Use<Snapshot>();

                                 x.For<ISitemapGenerator>().
                                   Use<SitemapGenerator>();

                                 x.For<ISitemapItem>().
                                   Use<SitemapItem>();

                                 x.For<ISecureDataFormat<AuthenticationTicket>>().
                                   Use(() => Startup.OAuthOptions.AccessTokenFormat);

                                 x.For<IExcelExportGenerator>().
                                   Use<ExcelExportGenerator>();
                               });
      return ObjectFactory.Container;
    }
  }
}