using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
    [DataContract(IsReference = true)]
    public class OperationTime
    {
        [Key]
        [DataMember]
        public virtual Guid OperationTimeId
        {
            get;
            set;
        }

        [DataMember]
        public virtual int CompanyHolidays
        {
            get;
            set;
        }

        [DataMember]
        public virtual int ShutdownDays
        {
            get;
            set;
        }
    }
}
