using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class Company
    {
        [Key]
        [DataMember]
        public virtual Guid CompanyId
        {
          get;
          set;
        }

        [Required]
        [StringLength(200)]
        [DataMember]
        public virtual string Name
        {
          get;
          set;
        }


        [DataMember]
        public virtual Guid AddressId
        {
          get;
          set;
        }

        [ForeignKey("AddressId")]
        [DataMember]
        public virtual Address Address
        {
          get;
          set;
        }

        [DataMember]
        public virtual ICollection<NetworkCompany> NetworkCompanies
        {
          get;
          set;
        }

        [DataMember]
        public virtual ICollection<UserProfile> Employees
        {
          get;
          set;
        }

        [DataMember]
        public virtual ICollection<Invitation> Invitations
        {
            get;
            set;
        }
    }
}