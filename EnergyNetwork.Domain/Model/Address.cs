using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.Spatial;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    public class Address
    {
        [Key]
        [DataMember]
        public virtual Guid AddressId
        {
          get;
          set;
        }

        [Required]
        [StringLength(200)]
        [DataMember]
        public virtual string Street
        {
          get;
          set;
        }

        [Required]
        [StringLength(100)]
        [DataMember]
        public virtual string PostalCode
        {
          get;
          set;
        }

        [Required]
        [StringLength(100)]
        [DataMember]
        public virtual string City
        {
          get;
          set;
        }

        [DataType(DataType.Url)]
        [DataMember]
        public virtual string Website
        {
          get;
          set;
        }

        [DataMember]
        public virtual double Lat
        {
          get;
          set;
        }

        [DataMember]
        public virtual double Lon
        {
          get;
          set;
        }
    }
}