import {
    r
} from "../../../db";
import {
    Tables
} from "../../controllers/generalInterfaces";
import {
    DB_NAME
} from "../../../constants";

/** 
* @type {{
*   type: "gt",
*   propName: String,
*   count: Number,
* }}
*/
const conditionsInterfaces = {
    propName: String,
    count: Number,
    type: String
};

/**
* @type {{
*   propName: String,
*   value: String
* }}
*/
const containsInterfaces = {
    propName: String,
    value: String
}

/**
* @type {{
*   tableName: Tables,
*   propName: String
* }}
*/
const filterIdsInterfaces = {
    tableName: String,
    propName: String
}

/**
* @type {{
*   containerPropName: String,
*   childrenPropName: String
* }}
*/
const mergePropFilters = {
    containerPropName: String,
    childrenPropName: String
}

/**
* @type {{
*    mergePropFilters: [mergePropFilters],
*    directlyMergeStatus: Boolean,
*    customMergeFilter: Object,
*    default: Object | String,
*    getCountStatus: Boolean,
*    mergePropID: String,
*    mergeProp: String,
*    tableName: Tables,
*    pluck: String,
*    limit: Number,
*    nth: Number
* }}
*/
const mergeInterfaces = {
    mergePropFilters: Array[mergePropFilters],
    directlyMergeStatus: Boolean,
    customMergeFilter: Object,
    default: Object | String,
    getCountStatus: Boolean,
    mergePropID: String,
    tableName: String,
    mergeProp: String,
    limit: Number,
    nth: Number
};
const nestedMergeInterfaces = {
    ...mergeInterfaces,
    containerMergePropName: String,
    uuidMerge: String
};

/**
* @type {{
*  nestedMerges: [nestedMergeInterfaces],
*  conditions: [conditionsInterfaces],
*  filterIds: [filterIdsInterfaces],
*  contains: [containsInterfaces],
*  returnDataPropName: String,
*  merges: [mergeInterfaces],
*  orderByPropName: String,
*  orderByStatus: Boolean,
*  emptyStatus: Boolean,
*  tableName: Tables,
*  filter: Object,
*  limit: Number,
*  nth: Number,
*  id: String
* }}
*/
const interfaces = {
    returnDataPropName: String,
    orderByPropName: String,
    orderByStatus: Boolean,
    emptyStatus: Boolean,
    nestedMerges: Array,
    conditions: Array,
    tableName: String,
    filterIds: Array,
    contains: Array,
    filter: Object,
    merges: Array,
    limit: Number,
    nth: Number,
    id: String
};

/** Db deki verileri çekmek için kullanılan fonksiyon
*   @example 
    get({
        tableName: "users",
        id: "1233" || filter: { id: "123" }
        orderByStatus: Boolean,
        merges: [
            {
                tableName: Tables,
                mergeProp: String,
                mergePropID: String,
            }
        ]
    })
* 
*/
const get = async ({
    returnDataPropName,
    orderByPropName,
    orderByStatus,
    nestedMerges,
    emptyStatus,
    conditions,
    filterIds,
    tableName,
    contains,
    filter,
    merges,
    limit,
    nth,
    id
} = interfaces) => {
    return await new Promise(async (resolve, reject) => {
        /* Main Query */
        let query = r.db(DB_NAME).table(tableName);

        /* İf orderBy status true update query */
        if (orderByStatus) {
            query = query.orderBy({ index: r.desc(orderByPropName ? orderByPropName : "createDate") })
        }

        if (conditions && conditions.length) {
            for (let index = 0; index < conditions.length; index++) {
                const condition = conditions[index];
                query = query.filter(function (filterData) {
                    let resolveCondition = null;

                    if (condition.type === "gt") {
                        return filterData(condition.propName).gt(condition.count);
                    }
                });
            }
        }

        /* Default Filter */
        if (id || filter) {
            const newFilter = id ? {
                id: id,
                visible: true
            } : filter;

            query = query.filter(newFilter);
        }

        /* Filter ID Datas */
        if (filterIds && filterIds.length) {
            for (let index = 0; index < filterIds.length; index++) {
                const filterIdObjcet = filterIds[index];
                const tableName = filterIdObjcet.tableName;
                const propName = filterIdObjcet.propName;

                query = query.filter(function (filterData) {
                    return r.db(DB_NAME).table(tableName).filter({
                        id: filterData(propName),
                        visible: true
                    }).count().ne(0)
                });
            }
        }

        /* Merge */
        if (merges && merges.length !== 0) {
            for (let index = 0; index < merges.length; index++) {
                /* Variables */
                const merge = merges[index];
                const tableName = merge.tableName;
                const mergeProp = merge.mergeProp;
                const mergePropID = merge.mergePropID;

                if (merge.directlyMergeStatus) {
                    query = query.merge(function (mergeProps) {
                        return r.db(DB_NAME).table(tableName).get(mergeProps(mergePropID))
                    })
                }
                else {
                    /* Create Container merge */
                    query = query.merge(function (mergeProps) {
                        /* Return & Controller Datas */
                        const newMerge = {};
                        const mergePropFilters = {};

                        /* Merge Prop Filters */
                        if (merge.mergePropFilters) {
                            merge.mergePropFilters.map((item, index) => {
                                mergePropFilters[item.childrenPropName] = mergeProps(item.containerPropName);
                            });
                        };

                        /* Add return data to merge */
                        newMerge[mergeProp] = r.db(DB_NAME).table(tableName).filter(merge.customMergeFilter ? {
                            ...merge.customMergeFilter,
                            ...mergePropFilters
                        } : {
                            id: mergeProps(mergePropID),
                            visible: true
                        }).coerceTo("array");

                        /* Get Count Status controller */
                        if (merge.getCountStatus) {
                            newMerge[mergeProp] = newMerge[mergeProp].count();
                        };

                        /* Limit Controller */
                        if (merge.limit) {
                            newMerge[mergeProp] = newMerge[mergeProp].limit(merge.limit);
                        };

                        return newMerge;
                    });
                }

            }
        }

        /* Nested Merge */
        if (nestedMerges && nestedMerges.length !== 0) {
            for (let index = 0; index < nestedMerges.length; index++) {
                /* Variables */
                const merge = nestedMerges[index];
                const tableName = merge.tableName;
                const mergeProp = merge.mergeProp;
                const mergePropID = merge.mergePropID;
                const containerMergePropName = merge.containerMergePropName;

                /* If merge is uuid array */
                if (merge.uuidMerge) {
                    /* Create Container merge for only uuidArray*/
                    query = query.merge(function (mergeData) {
                        /* Convert all uuid to object in id */
                        const newMerge = {};
                        newMerge[mergeProp] = mergeData(containerMergePropName).map(function (mapData) {
                            return {
                                id: mapData
                            }
                        });
                        return newMerge;
                    }).merge(function (mergeData) {
                        /* Merge all ids for table */
                        const newMerge = {};
                        newMerge[mergeProp] = mergeData(mergeProp).merge(function (mergeData) {
                            return r.db(DB_NAME).table(tableName).filter({
                                id: mergeData("id"),
                                visible: true
                            }).coerceTo("array")
                        });
                        return newMerge;
                    }).merge(function (mergeData) {
                        /* If merge is empty return null else return zero index */
                        const newMerge = {};
                        newMerge[mergeProp] = mergeData(mergeProp).map(function (mapData) {
                            return r.branch(
                                mapData.isEmpty(),
                                null,
                                mapData.nth(0)
                            )
                        });
                        return newMerge;
                    }).merge(function (mergeData) {
                        /* Only retrun object */
                        const newMerge = {};
                        newMerge[mergeProp] = mergeData(mergeProp).filter(function (filterData) {
                            return filterData.ne(null)
                        })
                        return newMerge;
                    });
                }
                else {
                    /* Create Container merge */
                    query = query.merge(function (mergeProps) {
                        /* Return merges */
                        const newMerge = {};

                        /* Create Children merge */
                        newMerge[containerMergePropName] = mergeProps(containerMergePropName).merge(function (nestedMergeProps) {
                            /* Return & Controller Datas */
                            const newNestedMerge = {};
                            const mergePropFilters = {};

                            /* Merge Prop Filters */
                            if (merge.mergePropFilters) {
                                merge.mergePropFilters.map((item) => {
                                    mergePropFilters[item.childrenPropName] = nestedMergeProps(item.containerPropName);
                                });
                            }

                            /* Add return data to nested merge */
                            newNestedMerge[mergeProp] = r.db(DB_NAME).table(tableName).filter(merge.customMergeFilter ? { ...merge.customMergeFilter, ...mergePropFilters } : {
                                id: nestedMergeProps(mergePropID),
                                visible: true
                            }).coerceTo("array");

                            /* Get Count Status */
                            if (merge.getCountStatus) {
                                newNestedMerge[mergeProp] = newNestedMerge[mergeProp].count();
                            }

                            return newNestedMerge
                        });

                        return newMerge
                    });
                }
            }
        }

        if (contains && contains.length) {
            for (let index = 0; index < contains.length; index++) {
                const containObject = contains[index];
                const value = containObject.value;
                const propName = containObject.propName;

                query = query.filter(function (filterData) {
                    return filterData(propName).contains(function (containData) {
                        return containData.eq(value)
                    })
                });
            }
        }

        if (limit) {
            query = query.limit(limit);
        }

        /* General Results */
        return await query.run().then((res) => {
            let datas = [];

            /* Merges Custom Proccess */
            res.map((item) => {
                if (merges && merges.length !== 0) {
                    merges.map((mergeItem) => {
                        const mergeProp = mergeItem.mergeProp;
                        if (typeof mergeItem.nth !== "undefined") {
                            item[mergeProp] = item[mergeProp].length !== 0 ?
                                mergeItem.pluck ? item[mergeProp][mergeItem.nth][mergeItem.pluck] : item[mergeProp][mergeItem.nth] :
                                mergeItem.default;
                        }
                    });
                }

                /* Nested Merge Controller */
                if (nestedMerges && nestedMerges.length !== 0) {
                    nestedMerges.map((nestedMergeItem) => {
                        /* Variables */
                        const mergeProp = nestedMergeItem.mergeProp;
                        const containerMergePropName = nestedMergeItem.containerMergePropName;

                        /* Nth Controller */
                        if (typeof nestedMergeItem.nth !== "undefined") {
                            /* Get Items for containerMergePropName  */
                            item[containerMergePropName].map((mergeContainerDatas, mergeContainerIndex) => {
                                /* If Exist pluck */
                                if (nestedMergeItem.pluck) {
                                    /* If container data nth index is not undefined and pluck datas is not undefined  */
                                    if (
                                        item[containerMergePropName][mergeContainerIndex][mergeProp].length !== 0 &&
                                        item[containerMergePropName][mergeContainerIndex][mergeProp][nestedMergeItem.nth][nestedMergeItem.pluck]
                                    ) {
                                        item[containerMergePropName][mergeContainerIndex][mergeProp] = mergeContainerDatas[mergeProp][nestedMergeItem.nth][nestedMergeItem.pluck];
                                    }

                                    /* Else return default data */
                                    else {
                                        item[containerMergePropName][mergeContainerIndex][mergeProp] = nestedMergeItem.default;
                                    }
                                }
                                else {
                                    /* If container data nth index is not undefined  */
                                    if (item[containerMergePropName][mergeContainerIndex][mergeProp].length !== 0) {
                                        item[containerMergePropName][mergeContainerIndex][mergeProp] = mergeContainerDatas[mergeProp][nestedMergeItem.nth];
                                    }
                                    /* Else return default data */
                                    else {
                                        item[containerMergePropName][mergeContainerIndex][mergeProp] = nestedMergeItem.default;
                                    }
                                }
                            });
                        }
                    });
                }

                datas.push(item);
            });

            if (typeof nth !== "undefined") {
                datas = res[nth].length !== 0 ? res[nth] : {}
            }

            const returnData = {};

            if (returnDataPropName) {
                returnData[returnDataPropName] = datas
            }
            else {
                returnData.datas = datas;
            }

            resolve({
                status: emptyStatus ? res.length === 0 ? false : true : true,
                response: {
                    message: "Başarı ile veriler getirilmiştir",
                    code: 200,
                },
                ...returnData
            })


        }).catch((err) => {
            resolve({
                status: false,
                response: {
                    code: 500,
                    message: err,
                },
                data: []
            })
        })
    })
};

export default get;