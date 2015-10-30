using System;
using System.Web.WebPages;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Web.Models;

namespace EnergyNetwork.Web.Helpers
{
  public static class ExtensionMethods
  {
    public static UserProfile Update(this UserProfile userProfile, UserProfileViewModel userProfileViewModel)
    {
      userProfile.FirstName = userProfileViewModel.FirstName;
      userProfile.LastName = userProfileViewModel.LastName;
      userProfile.Email = userProfileViewModel.Email;
      userProfile.PhoneNumber = userProfileViewModel.PhoneNumber;
      userProfile.Activated = userProfileViewModel.Activated;

      if (!userProfileViewModel.CompanyId.IsEmpty())
      {
        var guid = Guid.Parse(userProfileViewModel.CompanyId);
        if (!userProfile.CompanyId.Equals(guid))
        {
          userProfile.CompanyId = guid;
        }
      }
      else
      {
        userProfile.CompanyId = null;
      }

      return userProfile;
    }

    public static UserProfile Update(this UserProfile userProfile, UserManageViewModel userManageViewModel)
    {
      userProfile.FirstName = userManageViewModel.FirstName;
      userProfile.LastName = userManageViewModel.LastName;
      userProfile.Email = userManageViewModel.Email;
      userProfile.PhoneNumber = userManageViewModel.PhoneNumber;

      return userProfile;
    }
  }
}