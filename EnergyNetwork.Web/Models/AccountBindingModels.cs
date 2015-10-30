using System;
using System.ComponentModel.DataAnnotations;
using EnergyNetwork.Domain.Model;

namespace EnergyNetwork.Web.Models
{
  //AccountController parameter models
  public class AddExternalLoginBindingModel
  {
    [Required]
    public string ExternalAccessToken { get; set; }
  }

  public class ChangePasswordBindingModel
  {
    [Required]
    [DataType(DataType.Password)]
    public string OldPassword { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "{0} Zeichenanzahl muss mindestens gr&ouml;&szlig;er oder gleich {2} sein.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string NewPassword { get; set; }

    [DataType(DataType.Password)]
    [Compare("NewPassword", ErrorMessage = "Passwort und Best&auml;tigung m&uuml;ssen &uuml;bereinstimmen.")]
    public string ConfirmPassword { get; set; }
  }

  public class RegisterBindingModel
  {
    public string InvitationId { get; set; }

    [Required]
    public string UserName { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "{0} Zeichenanzahl muss mindestens gr&ouml;&szlig;er oder gleich {2} sein.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Contraseña")]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Confirmar contraseña")]
    [Compare("Password", ErrorMessage = "Passwort und Best&auml;tigung m&uuml;ssen &uuml;bereinstimmen.")]
    public string ConfirmPassword { get; set; }

    [Required]
    [StringLength(30)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [DataType(DataType.EmailAddress)]
    [StringLength(200)]
    [EmailAddress]
    public string Email { get; set; }

    [DataType(DataType.PhoneNumber)]
    [Phone]
    public string PhoneNumber { get; set; }

    public string CompanyId { get; set; }

    public string NetworkId { get; set; }

    [StringLength(50)]
    public string CompanyName { get; set; }

    [StringLength(50)]
    public string Street { get; set; }

    [DataType(DataType.PostalCode)]
    public string PostalCode { get; set; }

    [StringLength(50)]
    public string City { get; set; }

    [StringLength(200)]
    public string Website { get; set; }

    public double Lat { get; set; }

    public double Lon { get; set; }

  }

  public class RegisterExternalBindingModel
  {
    [Required]
    public string UserName { get; set; }

    [Required]
    [DataType(DataType.EmailAddress)]
    [StringLength(200)]
    [EmailAddress]
    public string Email { get; set; }
  }

  public class RemoveLoginBindingModel
  {
    [Required]
    public string LoginProvider { get; set; }

    [Required]
    public string ProviderKey { get; set; }
  }

  public class SetPasswordBindingModel
  {
    [Required]
    [StringLength(100, ErrorMessage = "{0} Zeichenanzahl muss mindestens gr&ouml;&szlig;er oder gleich {2} sein.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string NewPassword { get; set; }

    [DataType(DataType.Password)]
    [Compare("NewPassword", ErrorMessage = "Passwort und Best&auml;tigung m&uuml;ssen &uuml;bereinstimmen.")]
    public string ConfirmPassword { get; set; }
  }

  public class ForgotPasswordBindingModel
  {
    [Required]
    [EmailAddress]
    public string Email { get; set; }
  }

  public class ResetPasswordBindingModel
  {
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "{0} Zeichenanzahl muss mindestens gr&ouml;&szlig;er oder gleich {2} sein.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Confirm password")]
    [Compare("Password", ErrorMessage = "Passwort und Best&auml;tigung m&uuml;ssen &uuml;bereinstimmen.")]
    public string ConfirmPassword { get; set; }

    public string Code { get; set; }
  }
}