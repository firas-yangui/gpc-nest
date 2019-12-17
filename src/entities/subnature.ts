import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {price} from "./price";
import {mixsourcingstandard} from "./mixsourcingstandard";
import {pre_validation_price} from "./pre_validation_price";
import {workload} from "./workload";
import {subnatureappsettings} from "./subnatureappsettings";
import {bipexceptionrule} from "./bipexceptionrule";
import {sourcingplan} from "./sourcingplan";


@Entity("subnature" ,{schema:"public" } )
@Index("subnature_code_unique_idx",["code",],{unique:true})
export class subnature {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        length:16,
        name:"code"
        })
    code:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:32,
        name:"name"
        })
    name:string;
        

    @Column("text",{ 
        nullable:false,
        default: () => "'KEURO'",
        name:"amountunit"
        })
    amountunit:string;
        

    @Column("boolean",{ 
        nullable:true,
        default: () => "true",
        name:"iscashout"
        })
    iscashout:boolean | null;
        

    @Column("boolean",{ 
        nullable:false,
        default: () => "false",
        name:"isworkforce"
        })
    isworkforce:boolean;
        

   
    @OneToMany(()=>price, (price: price)=>price.subnature)
    prices:price[];
    

   
    @OneToMany(()=>mixsourcingstandard, (mixsourcingstandard: mixsourcingstandard)=>mixsourcingstandard.subnature)
    mixsourcingstandards:mixsourcingstandard[];
    

   
    @OneToMany(()=>pre_validation_price, (pre_validation_price: pre_validation_price)=>pre_validation_price.subnature)
    preValidationPrices:pre_validation_price[];
    

   
    @OneToMany(()=>workload, (workload: workload)=>workload.subnature,{ onUpdate: 'CASCADE' })
    workloads:workload[];
    

   
    @OneToMany(()=>subnatureappsettings, (subnatureappsettings: subnatureappsettings)=>subnatureappsettings.model)
    subnatureappsettingss:subnatureappsettings[];
    

   
    @OneToMany(()=>bipexceptionrule, (bipexceptionrule: bipexceptionrule)=>bipexceptionrule.subnature)
    bipexceptionrules:bipexceptionrule[];
    

   
    @OneToMany(()=>sourcingplan, (sourcingplan: sourcingplan)=>sourcingplan.subnature)
    sourcingplans:sourcingplan[];
    
}
