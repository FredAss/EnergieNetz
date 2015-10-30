#region License

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at
//  
// http://www.apache.org/licenses/LICENSE-2.0.html
//  
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  
// Copyright (c) 2013, HTW Berlin

#endregion

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class InvestmentPlan
  {
    [Key]
    [DataMember]
    public virtual Guid InvestmentPlanId { get; set; }

    [Required]
    [DataMember]
    public virtual int Lifetime { get; set; }

    [Required]
    [DataMember]
    public virtual float InvestmentSum { get; set; }

    [DataMember]
    public virtual float RecoveryValueToday { get; set; }

    [DataMember]
    public virtual float RecoveryValueAfterLifetime { get; set; }

    [Required]
    [DataMember]
    public virtual float EnergyCostsAnnual { get; set; }

    [DataMember]
    public virtual float EnergyCostsChangePA { get; set; }

    [DataMember]
    public virtual float OtherCostsPA { get; set; }

    [DataMember]
    public virtual float OtherRevenuePA { get; set; }


    [DataMember]
    public virtual Guid? CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    [DataMember]
    public virtual Company Company { get; set; }

    [Required]
    [DataMember]
    public virtual string InvestmentName { get; set; }

    [DataMember]
    public virtual string Description { get; set; }

    [DataMember]
    public virtual DateTime StartYear { get; set; }

    [Required]
    [DataMember]
    public virtual float ImputedInterestRate { get; set; }

    [DataMember]
    public virtual float OtherCostsChangePA { get; set; }

    [DataMember]
    public virtual float OtherRevenueChangePA { get; set; }

    [DataMember]
    public virtual ICollection<Comparison> Comparisons { get; set; }
  }
}