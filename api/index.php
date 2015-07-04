<?php
require 'db.php';
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();



$app->get('/items', function ()
{
    $sql = "SELECT * FROM item ORDER BY itemId DESC";
    try
    {
        $db = get_db();
        $stmt = $db->query($sql);
        $package = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode(array(
            "Items" => $package
        ));
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



$app->get('/npc/:id', function ($id)
{
    $sql = "SELECT * FROM npc WHERE npcId = $id LIMIT 1";
    $sql2 = "SELECT * FROM item, npc_item WHERE npc_item.npcId = $id AND item.itemId = npc_item.itemId GROUP BY npc_item.itemId ORDER BY npc_item.itemId DESC";
    try
    {
        $db = get_db();
        $stmt = $db->query($sql);
        $package = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt = $db->query($sql2);
        $package[0]["items"] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $db = null;
        echo json_encode(array(
            "NPC" => $package[0]
        ));
    }
    catch(PDOException $e)
    {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});



$app->get('/regions', function ()
{
    $sql = "SELECT * FROM region ORDER BY regionId DESC";
    try
    {
        $db = get_db();
        $stmt = $db->query($sql);
        $package = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode(array(
            "Region" => $package
        ));
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



    $app->get('/region/:id', function ($id)
    {
        $sql = "SELECT * FROM region WHERE regionId = $id LIMIT 1";
        $sql1 = "SELECT * FROM location WHERE regionId = $id ORDER BY location.order ASC";
        try
        {
            $db = get_db();
            $stmt = $db->query($sql);
            $package = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stmt = $db->query($sql1);
            $package[0]['locations'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $db = null;
            echo json_encode(array(
                "Region" => $package[0]
            ));
        }
        catch (PDOException $e)
        {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    });



$app->get('/location/:id', function ($id)
{
    $sql = "SELECT * FROM location WHERE locationId = $id LIMIT 1";
    $sql1 = "SELECT * FROM room WHERE room.locationId = $id";
    try
    {
        $db = get_db();
        $stmt = $db->query($sql);
        $package = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt = $db->query($sql1);
        //$package[0]['rooms'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $rooms = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $roomId = $row['roomId'];
            $stmt = $db->query("SELECT vesselId, position FROM vessel WHERE roomId = $roomId");
            $row['vessels'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $rooms[] = $row;
        }

        $package[0]['rooms'] = $rooms;

        $db = null;
        echo json_encode(array(
            "Location" => $package[0]
        ));
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



$app->get('/vessel/:id', function ($id)
{
    $sql = "SELECT * FROM vessel, vessel_type WHERE vessel.vesselId = $id AND vessel.vesselTypeId = vessel_type.vesselTypeId GROUP BY vessel.vesselId LIMIT 1";
    $sql1 = "SELECT * FROM vessel_item, item WHERE vessel_item.vesselId = $id AND vessel_item.itemId = item.itemId GROUP BY item.itemId ORDER BY item.name";
    try
    {
        $db = get_db();
        $stmt = $db->query($sql);
        $package = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt = $db->query($sql1);
        $package[0]['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $db = null;
        echo json_encode(array(
            "Vessel" => $package[0]
        ));
    }
    catch (PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
});



$app->run();
