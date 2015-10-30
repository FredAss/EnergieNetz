using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class FiscalYear
    {
        [Key]
        [DataMember]
        public virtual Guid FiscalYearId
        {
            get;
            set;
        }

        [DataMember]
        public virtual bool IsCalendarYear
        {
            get;
            set;
        }

        [DataMember]
        public virtual bool IsKMU
        {
            get;
            set;
        }
    
    }
}