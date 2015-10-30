using System;
using System.Collections.Generic;
using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.Validators;
using System.Web;
using Microsoft.AspNet.Identity;
using System.Web.Http;


namespace EnergyNetwork.Web.Helpers
{
    public class BreezeValidator : IBreezeValidator
    {
        private ApplicationUserManager UserManager { get; set; }

        public BreezeValidator(ApplicationUserManager usermanager)
        {
            UserManager = usermanager;
        }

        public bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            // Add custom logic here in order to save entities
            // Return false if don´t want to  save the entity 

            return true;
        }

        public Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            // Add custom logic here in order to save entities

            List<EntityInfo> userprofiles;

            // - In order to save and manage accounts you need to use the AccountController and not Breeze

            if (saveMap.TryGetValue(typeof (UserProfile),
                out userprofiles))
            {
                var errors = userprofiles.Select(oi =>
                                                 {
                                                     return new EFEntityError(oi,
                                                         "Save Failed",
                                                         "Cannot save Users using the Breeze api",
                                                         "UserProfileId");
                                                 });
                throw new EntityErrorsException(errors);
            }

            return saveMap;
        }
    }
}