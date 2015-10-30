using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class CompanySize
    {
        [Key]
        [DataMember]
        public virtual Guid CompanySizeId
        {
            get;
            set;
        }

        [DataMember]
        public virtual int NumberOfEmployees
        {
            get;
            set;
        }

        [DataMember]
        public virtual double TotalRevenue
        {
            get;
            set;
        }

        [DataMember]
        public virtual double TotalEnergyCosts
        {
            get;
            set;
        }

        [DataMember]
        public virtual double LastYearsEnergyTaxRefund
        {
            get;
            set;
        }

    
    }
}