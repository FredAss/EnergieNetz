using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class VolumeOfSale
    {
        [Key]
        [DataMember]
        public virtual Guid VolumeOfSaleId
        {
          get;
          set;
        }

        [DataMember]
        public virtual DateTime RelatedDuration { get; set; }

        [DataMember]
        public virtual double Value
        {
          get;
          set;
        }

        [DataMember]
        public virtual Guid NetworkCompanyId
        {
          get;
          set;
        }

        [ForeignKey("NetworkCompanyId")]
        [DataMember]
        public virtual NetworkCompany NetworkCompany
        {
          get;
          set;
        }
    }
}