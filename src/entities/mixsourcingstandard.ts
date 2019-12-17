import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {thirdparty} from "./thirdparty";
import {subnature} from "./subnature";


@Entity("mixsourcingstandard" ,{schema:"public" } )
export class mixsourcingstandard {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>thirdparty, (thirdparty: thirdparty)=>thirdparty.mixsourcingstandards,{  })
    @JoinColumn({ name:'thirdpartyid'})
    thirdparty:thirdparty | null;


   
    @ManyToOne(()=>subnature, (subnature: subnature)=>subnature.mixsourcingstandards,{  })
    @JoinColumn({ name:'subnatureid'})
    subnature:subnature | null;


    @Column("real",{ 
        nullable:true,
        precision:24,
        name:"percent"
        })
    percent:number | null;
        
}
