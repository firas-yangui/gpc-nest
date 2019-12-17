import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {thirdparty} from "./thirdparty";
import {subnature} from "./subnature";


@Entity("price" ,{schema:"public" } )
@Index("price_unicity",["periodtype","subnature","thirdparty",],{unique:true})
export class price {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("double precision",{ 
        nullable:true,
        precision:53,
        name:"price"
        })
    price:number | null;
        

   
    @ManyToOne(()=>thirdparty, (thirdparty: thirdparty)=>thirdparty.prices,{  nullable:false, })
    @JoinColumn({ name:'thirdpartyid'})
    thirdparty:thirdparty | null;


   
    @ManyToOne(()=>subnature, (subnature: subnature)=>subnature.prices,{  nullable:false, })
    @JoinColumn({ name:'subnatureid'})
    subnature:subnature | null;


    @Column("double precision",{ 
        nullable:true,
        precision:53,
        name:"saleprice"
        })
    saleprice:number | null;
        

    @Column("enum",{ 
        nullable:false,
        default: () => "'budget'",
        enum:["notified","actual","sum","committed","budget","forecast"],
        name:"periodtype"
        })
    periodtype:string;
        

    @Column("date",{ 
        nullable:true,
        name:"updatedate"
        })
    updatedate:string | null;
        
}
